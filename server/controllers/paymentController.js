const axios = require('axios');
const prisma = require('../config/prisma');
const { sendStudentPassEmail } = require('../services/emailService');

// In-memory store for pending orders awaiting payment verification
const pendingOrders = new Map();

/**
 * Get Cashfree PG Base API URL based on Environment
 */
const getCashfreeBaseUrl = () => {
  const env = (process.env.CASHFREE_ENV || 'PRODUCTION').toUpperCase();
  return env === 'SANDBOX'
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg';
};

/**
 * Get standard Cashfree API headers
 */
const getCashfreeHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-client-id': process.env.CASHFREE_APP_ID || '',
    'x-client-secret': process.env.CASHFREE_SECRET_KEY || '',
    'x-api-version': process.env.CASHFREE_API_VERSION || '2023-08-01',
    'accept': 'application/json'
  };
};

/**
 * 1. Initiate Cashfree Live Payment Order
 * Route: POST /api/v1/payments/create-order
 */
const createPaymentOrder = async (req, res) => {
  try {
    const {
      studentName,
      email,
      phone,
      collegeName,
      venueLocation,
      branch,
      year,
      bloodGroup,
      degree,
      marksTenth,
      marksTwelfth,
      selfiePhotoUrl,
      programTitle,
      summitId,
      baseAmount,
      gstAmount,
      platformFee,
      amountPaid
    } = req.body;

    const totalAmountInINR = (amountPaid !== undefined && amountPaid !== null && !isNaN(Number(amountPaid))) ? Number(amountPaid) : 1999;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const baseUrl = getCashfreeBaseUrl();
    const headers = getCashfreeHeaders();

    // Unique Order ID for Cashfree (Alphanumeric, max 45 chars)
    const orderId = `order_vm_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Sanitize customer details for Cashfree
    const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '9876543210';
    const validPhone = cleanPhone.length === 10 ? cleanPhone : '9876543210';
    const cleanEmail = (email && email.includes('@')) ? email.trim() : 'student@vmanous.com';
    const cleanName = (studentName || 'Student Participant').trim().slice(0, 50);
    const customerId = `cust_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 18)}_${Date.now().toString().slice(-4)}`;

    // Store pending order details
    const orderDetails = {
      orderId,
      studentName: cleanName,
      email: cleanEmail,
      phone: validPhone,
      collegeName: collegeName || '',
      venueLocation: venueLocation || '',
      branch: branch || '',
      year: year || '',
      bloodGroup: bloodGroup || null,
      degree: degree || '',
      marksTenth: marksTenth || '',
      marksTwelfth: marksTwelfth || '',
      selfiePhotoUrl: selfiePhotoUrl || '',
      programTitle: programTitle || 'AI Summit Workshop',
      summitId: summitId ? Number(summitId) : null,
      baseAmount: baseAmount !== undefined ? Number(baseAmount) : null,
      gstAmount: gstAmount !== undefined ? Number(gstAmount) : null,
      platformFee: platformFee !== undefined ? Number(platformFee) : null,
      amountPaid: totalAmountInINR,
      createdAt: new Date()
    };
    pendingOrders.set(orderId, orderDetails);

    // Ensure Cashfree Live return_url strictly uses HTTPS
    let safeReturnUrlBase = frontendUrl.trim();
    if (!safeReturnUrlBase.startsWith('https://')) {
      safeReturnUrlBase = safeReturnUrlBase.replace(/^http:\/\//i, 'https://');
    }
    const returnUrl = `${safeReturnUrlBase}/payment-callback?order_id={order_id}`;

    // Cashfree PG Order Payload (v2023-08-01)
    const orderPayload = {
      order_id: orderId,
      order_amount: Number(totalAmountInINR.toFixed(2)),
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_name: cleanName,
        customer_email: cleanEmail,
        customer_phone: validPhone
      },
      order_meta: {
        return_url: returnUrl
      },
      order_note: `Workshop: ${(programTitle || 'Vmanous AI').slice(0, 50)}`
    };

    console.log(`[Cashfree Init] Creating Live Order ${orderId} for ₹${totalAmountInINR} at ${baseUrl}/orders`);

    const response = await axios.post(
      `${baseUrl}/orders`,
      orderPayload,
      { headers, timeout: 15000 }
    );

    if (response.data && response.data.payment_session_id) {
      const paymentSessionId = response.data.payment_session_id;
      const cfOrderId = response.data.cf_order_id;
      const isProduction = (process.env.CASHFREE_ENV || 'PRODUCTION').toUpperCase() !== 'SANDBOX';

      console.log(`[Cashfree Success] Live Session Created: ${paymentSessionId}, CF Order ID: ${cfOrderId}`);

      return res.status(200).json({
        success: true,
        orderId: orderId,
        paymentSessionId: paymentSessionId,
        cfOrderId: cfOrderId,
        environment: isProduction ? 'production' : 'sandbox'
      });
    } else {
      console.error('[Cashfree Init Error] Unexpected Response:', response.data);
      return res.status(400).json({
        success: false,
        error: response.data?.message || 'Cashfree Order Initialization Failed'
      });
    }
  } catch (error) {
    console.error('[Cashfree Controller Error]', error.response?.data || error.message);
    const msg = error.response?.data?.message || error.message || 'Failed to communicate with Cashfree Payment Server';
    return res.status(500).json({
      success: false,
      error: msg
    });
  }
};

/**
 * 2. Verify Cashfree Payment Status & Record in Database
 * Route: POST /api/v1/payments/verify-status
 */
const verifyPaymentStatus = async (req, res) => {
  try {
    const { orderId, merchantTransactionId, formData } = req.body;
    const targetOrderId = orderId || merchantTransactionId;

    if (!targetOrderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required for verification' });
    }

    console.log(`[Cashfree Status Check] Initiating verification for Order: ${targetOrderId}`);

    // Check if this payment was ALREADY verified and stored in database (Idempotency Check)
    const existingApp = await prisma.application.findFirst({
      where: {
        transactionId: targetOrderId
      }
    });

    if (existingApp && existingApp.paymentStatus === 'Paid') {
      console.log(`[Cashfree Status Check] Order ${targetOrderId} already verified in DB.`);
      return res.status(200).json({
        success: true,
        message: 'Payment already verified successfully',
        data: existingApp
      });
    }

    // Merge in-memory pending order data with frontend cached formData as fallback
    const pendingOrderData = pendingOrders.get(targetOrderId) || {};
    const orderDetails = {
      ...formData,
      ...pendingOrderData,
      studentName: pendingOrderData.studentName || (formData ? `${formData.firstName || ''} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName || ''}`.trim() : '') || formData?.studentName || 'Student Participant',
      email: pendingOrderData.email || formData?.email || 'student@example.com',
      phone: pendingOrderData.phone || formData?.phone || '9876543210',
      collegeName: pendingOrderData.collegeName || formData?.institution || formData?.collegeName || 'Partner College',
      venueLocation: pendingOrderData.venueLocation || formData?.collegeAddress || formData?.venueLocation || 'Campus Auditorium',
      branch: pendingOrderData.branch || formData?.branch || formData?.specialization || 'Computer Science & Engineering',
      year: pendingOrderData.year || formData?.semester || formData?.year || formData?.yearOfStudy || '3rd Year',
      bloodGroup: pendingOrderData.bloodGroup || formData?.bloodGroup || null,
      degree: pendingOrderData.degree || formData?.degree || formData?.qualification || 'B.Tech',
      marksTenth: pendingOrderData.marksTenth || formData?.tenthPercentage || formData?.tenthPercent || '85.0%',
      marksTwelfth: pendingOrderData.marksTwelfth || formData?.twelfthPercentage || formData?.twelfthPercent || '85.0%',
      selfiePhotoUrl: pendingOrderData.selfiePhotoUrl || formData?.selfie || formData?.selfiePhotoUrl || formData?.photoPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
      programTitle: pendingOrderData.programTitle || formData?.programInterest || formData?.programTitle || 'AI Summit Workshop 2026',
      summitId: pendingOrderData.summitId || formData?.summitId || null,
      amountPaid: (pendingOrderData.amountPaid !== undefined && pendingOrderData.amountPaid !== null)
        ? Number(pendingOrderData.amountPaid)
        : (formData?.totalAmount !== undefined && formData?.totalAmount !== null
          ? Number(formData.totalAmount)
          : (formData?.amountPaid !== undefined && formData?.amountPaid !== null ? Number(formData.amountPaid) : 0))
    };

    const baseUrl = getCashfreeBaseUrl();
    const headers = getCashfreeHeaders();

    let isSuccess = false;
    let orderStatus = 'PENDING';
    let paymentMethod = 'Cashfree PG (UPI/Cards/NetBanking)';
    let cfPaymentId = null;

    try {
      // 1. Fetch Order Status from Cashfree
      const orderResponse = await axios.get(
        `${baseUrl}/orders/${targetOrderId}`,
        { headers, timeout: 15000 }
      );

      console.log(`[Cashfree Order Status API Response]:`, orderResponse.data);

      orderStatus = orderResponse.data?.order_status;
      if (orderStatus === 'PAID') {
        isSuccess = true;
      }

      // 2. Fetch specific payment attempt details if available
      try {
        const paymentsResponse = await axios.get(
          `${baseUrl}/orders/${targetOrderId}/payments`,
          { headers, timeout: 10000 }
        );
        if (Array.isArray(paymentsResponse.data) && paymentsResponse.data.length > 0) {
          const successfulPayment = paymentsResponse.data.find(p => p.payment_status === 'SUCCESS') || paymentsResponse.data[0];
          if (successfulPayment) {
            cfPaymentId = successfulPayment.cf_payment_id;
            if (successfulPayment.payment_group) {
              paymentMethod = `Cashfree (${successfulPayment.payment_group.toUpperCase()})`;
            }
          }
        }
      } catch (payDetailsErr) {
        console.log('[Cashfree Payments Details Notice]:', payDetailsErr.message);
      }
    } catch (apiErr) {
      console.warn('[Cashfree Status API Error]:', apiErr.response?.data || apiErr.message);
      isSuccess = false;
      orderStatus = apiErr.response?.data?.order_status || apiErr.response?.data?.code || 'STATUS_CHECK_FAILED';
    }

    const totalPaid = (orderDetails.amountPaid !== undefined && orderDetails.amountPaid !== null && !isNaN(Number(orderDetails.amountPaid))) ? Number(orderDetails.amountPaid) : 0;

    // Lookup summit to calculate dynamic GST and base amounts
    let dynamicBase = 0;
    let dynamicGst = 0;

    let matchedSummit = null;
    if (orderDetails.summitId) {
      matchedSummit = await prisma.summit.findUnique({ where: { id: Number(orderDetails.summitId) } });
    }
    if (!matchedSummit && orderDetails.programTitle) {
      matchedSummit = await prisma.summit.findFirst({
        where: { title: orderDetails.programTitle }
      });
    }

    if (matchedSummit) {
      const basePrice = matchedSummit.price !== undefined ? Number(matchedSummit.price) : 1999;
      const taxRate = matchedSummit.taxRate !== undefined ? Number(matchedSummit.taxRate) : 18;
      const taxMode = matchedSummit.taxMode || 'Exclusive';

      if (basePrice === 0 || taxMode === 'Free') {
        dynamicBase = 0;
        dynamicGst = 0;
      } else if (taxMode === 'Inclusive') {
        dynamicGst = Number(((basePrice * taxRate) / (100 + taxRate)).toFixed(2));
        dynamicBase = Number((basePrice - dynamicGst).toFixed(2));
      } else {
        dynamicBase = Number(basePrice.toFixed(2));
        dynamicGst = Number(((basePrice * taxRate) / 100).toFixed(2));
      }
    } else {
      dynamicBase = Number((totalPaid / 1.18).toFixed(2));
      dynamicGst = Number((totalPaid - dynamicBase).toFixed(2));
    }

    const baseAmount = orderDetails.baseAmount !== undefined && orderDetails.baseAmount !== null
      ? Number(orderDetails.baseAmount)
      : dynamicBase;
    const gstAmount = orderDetails.gstAmount !== undefined && orderDetails.gstAmount !== null
      ? Number(orderDetails.gstAmount)
      : dynamicGst;

    const passCode = `PASS-${(orderDetails.collegeName || 'VM').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const photoUrl = orderDetails.selfiePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300';

    if (isSuccess) {
      // 1. Check if application was already created in a concurrent request
      let app = await prisma.application.findFirst({
        where: { transactionId: targetOrderId }
      });

      if (!app) {
        app = await prisma.application.create({
          data: {
            studentName: orderDetails.studentName,
            email: orderDetails.email,
            phone: orderDetails.phone,
            collegeName: orderDetails.collegeName,
            venueLocation: orderDetails.venueLocation,
            branch: orderDetails.branch,
            year: orderDetails.year,
            degree: orderDetails.degree,
            marksTenth: String(orderDetails.marksTenth || ''),
            marksTwelfth: String(orderDetails.marksTwelfth || ''),
            selfiePhotoUrl: photoUrl,
            programTitle: orderDetails.programTitle,
            summitId: orderDetails.summitId ? Number(orderDetails.summitId) : null,
            paymentStatus: 'Paid',
            verificationStatus: 'Verified',
            transactionId: targetOrderId,
            amountPaid: totalPaid,
            baseAmount,
            gstAmount,
            passCode
          }
        });
      }

      // 2. Safely create or find PaymentTransaction record
      try {
        const existingTxn = await prisma.paymentTransaction.findUnique({
          where: { transactionId: targetOrderId }
        });

        if (!existingTxn) {
          await prisma.paymentTransaction.create({
            data: {
              applicationId: app.id,
              transactionId: targetOrderId,
              studentName: app.studentName,
              email: app.email,
              phone: app.phone,
              collegeName: app.collegeName,
              programTitle: app.programTitle,
              amountPaid: totalPaid,
              baseAmount,
              gstAmount,
              paymentStatus: 'Paid',
              paymentMethod: paymentMethod,
              passCode: app.passCode || passCode
            }
          });
        }
      } catch (txnErr) {
        console.warn('[PaymentTransaction Notice] Transaction record already created or logged:', txnErr.message);
      }

      // 2b. Safely sync into Student model roster
      try {
        const studentEmail = (app.email || '').trim().toLowerCase();
        if (studentEmail) {
          await prisma.student.upsert({
            where: { email: studentEmail },
            update: {
              name: app.studentName,
              phone: app.phone,
              collegeName: app.collegeName,
              branch: app.branch,
              year: app.year,
              passCode: app.passCode || passCode
            },
            create: {
              name: app.studentName,
              email: studentEmail,
              phone: app.phone,
              collegeName: app.collegeName,
              branch: app.branch,
              year: app.year,
              passCode: app.passCode || passCode
            }
          });
        }
      } catch (stuErr) {
        console.warn('[Student Roster Sync Notice]:', stuErr.message);
      }

      // 3. Automatically Dispatch Workshop Pass PDF via Email in Background
      const emailPayload = {
        ...app,
        bloodGroup: orderDetails.bloodGroup || null
      };

      sendStudentPassEmail(emailPayload).catch(err =>
        console.error('[PDF Pass Email Dispatch Error]:', err.message)
      );

      pendingOrders.delete(targetOrderId);

      return res.status(200).json({
        success: true,
        message: 'Payment Verified & Application Saved Successfully',
        data: emailPayload
      });
    } else {
      console.log(`[Cashfree Status Check] Order ${targetOrderId} failed/incomplete (${orderStatus}).`);
      pendingOrders.delete(targetOrderId);

      return res.status(200).json({
        success: false,
        paymentStatus: 'Failed',
        paymentCode: orderStatus,
        error: `Payment was not completed (${orderStatus})`,
        orderId: targetOrderId,
        programTitle: orderDetails.programTitle,
        collegeName: orderDetails.collegeName,
        amountPaid: orderDetails.amountPaid
      });
    }
  } catch (error) {
    console.error('[Cashfree Status Verification Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify Cashfree payment status'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentStatus
};

