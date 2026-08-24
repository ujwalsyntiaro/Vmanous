const crypto = require('crypto');
const axios = require('axios');
const prisma = require('../config/prisma');
const { sendStudentPassEmail } = require('../services/emailService');

// In-memory store for pending orders awaiting payment verification
const pendingOrders = new Map();

/**
 * 1. Initiate PhonePe Payment Order
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
      amountPaid
    } = req.body;

    const totalAmountInINR = Number(amountPaid) || 2358.82;
    const amountInPaise = Math.round(totalAmountInINR * 100);

    const merchantId = process.env.PHONEPE_CLIENT_ID || 'PGTESTPAYUAT86';
    const saltKey = process.env.PHONEPE_CLIENT_SECRET || '96434309-7796-489d-8924-ab56988a6076';
    const saltIndex = process.env.PHONEPE_CLIENT_VERSION || '1';
    const hostUrl = process.env.PHONEPE_HOST || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Unique Merchant Transaction ID for PhonePe
    const merchantTransactionId = `TXN_PHPE_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // Store pending order details
    const orderDetails = {
      merchantTransactionId,
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
      summitId: summitId ? Number(summitId) : null,
      amountPaid: totalAmountInINR,
      createdAt: new Date()
    };
    pendingOrders.set(merchantTransactionId, orderDetails);

    // PhonePe Payload Format
    const payload = {
      merchantId: merchantId,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: `MUID_${(email || 'USER').replace(/[^a-zA-Z0-9]/g, '').slice(0, 15)}_${Date.now().toString().slice(-4)}`,
      amount: amountInPaise,
      redirectUrl: `${frontendUrl}/payment-callback?merchantTransactionId=${merchantTransactionId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${frontendUrl}/payment-callback?merchantTransactionId=${merchantTransactionId}`,
      mobileNumber: phone ? String(phone).replace(/\D/g, '').slice(-10) : '9876543210',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const apiEndpoint = '/pg/v1/pay';

    // X-VERIFY checksum calculation: SHA256(Base64_Payload + Endpoint + SaltKey) + "###" + SaltIndex
    const stringToHash = base64Payload + apiEndpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerifyHeader = `${sha256}###${saltIndex}`;

    console.log(`[PhonePe Init] Calling PhonePe Pay API for Txn: ${merchantTransactionId}, Amount: ₹${totalAmountInINR}`);

    // Call PhonePe UAT Sandbox / Production API
    const response = await axios.post(
      `${hostUrl}${apiEndpoint}`,
      { request: base64Payload },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerifyHeader,
          'accept': 'application/json'
        }
      }
    );

    if (response.data && response.data.success) {
      const redirectUrl = response.data.data?.instrumentResponse?.redirectInfo?.url;
      console.log(`[PhonePe Success] PhonePe Redirect URL generated: ${redirectUrl}`);
      return res.status(200).json({
        success: true,
        redirectUrl: redirectUrl,
        merchantTransactionId: merchantTransactionId
      });
    } else {
      console.error('[PhonePe Init Error] Response:', response.data);
      return res.status(400).json({
        success: false,
        error: response.data?.message || 'PhonePe Payment Initialization Failed'
      });
    }
  } catch (error) {
    console.error('[PhonePe Controller Error]', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || 'Failed to communicate with PhonePe Payment Server'
    });
  }
};

/**
 * 2. Verify PhonePe Payment Status & Record in Database
 * Route: POST /api/v1/payments/verify-status
 */
const verifyPaymentStatus = async (req, res) => {
  try {
    const { merchantTransactionId, formData } = req.body;

    if (!merchantTransactionId) {
      return res.status(400).json({ success: false, error: 'Merchant Transaction ID is required' });
    }

    console.log(`[PhonePe Status Check] Initiating verification for Txn: ${merchantTransactionId}`);

    // Check if this payment was ALREADY verified and stored in database (Idempotency Check)
    const existingApp = await prisma.application.findFirst({
      where: {
        transactionId: merchantTransactionId
      }
    });

    if (existingApp && existingApp.paymentStatus === 'Paid') {
      console.log(`[PhonePe Status Check] Transaction ${merchantTransactionId} already verified in DB.`);
      return res.status(200).json({
        success: true,
        message: 'Payment already verified successfully',
        data: existingApp
      });
    }

    // Merge in-memory pending order data with frontend cached formData as fallback
    const pendingOrderData = pendingOrders.get(merchantTransactionId) || {};
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
      amountPaid: Number(pendingOrderData.amountPaid || formData?.totalAmount || formData?.amountPaid || 2358.82)
    };

    const merchantId = process.env.PHONEPE_CLIENT_ID || 'PGTESTPAYUAT86';
    const saltKey = process.env.PHONEPE_CLIENT_SECRET || '96434309-7796-489d-8924-ab56988a6076';
    const saltIndex = process.env.PHONEPE_CLIENT_VERSION || '1';
    const hostUrl = process.env.PHONEPE_HOST || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
    const isSandbox = (process.env.PHONEPE_ENV || 'SANDBOX').toUpperCase() === 'SANDBOX';

    const statusEndpoint = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const stringToHash = statusEndpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
    const xVerifyHeader = `${sha256}###${saltIndex}`;

    let isSuccess = false;
    let paymentCode = 'PENDING';
    let phonePeTxnId = merchantTransactionId;

    try {
      const response = await axios.get(`${hostUrl}${statusEndpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVerifyHeader,
          'X-MERCHANT-ID': merchantId,
          'accept': 'application/json'
        },
        timeout: 10000
      });

      console.log(`[PhonePe Status API Response]`, response.data);

      const code = response.data?.code;
      const state = response.data?.data?.state;
      const responseCode = response.data?.data?.responseCode;

      if (
        response.data?.success &&
        (code === 'PAYMENT_SUCCESS' || code === 'SUCCESS' || state === 'COMPLETED' || responseCode === 'SUCCESS')
      ) {
        isSuccess = true;
        paymentCode = 'PAYMENT_SUCCESS';
        phonePeTxnId = response.data.data?.transactionId || merchantTransactionId;
      } else {
        isSuccess = false;
        paymentCode = code || responseCode || state || 'PAYMENT_FAILED';
      }
    } catch (apiErr) {
      console.warn('[PhonePe Status API Error]:', apiErr.response?.data || apiErr.message);
      isSuccess = false;
      paymentCode = apiErr.response?.data?.code || apiErr.response?.data?.message || 'STATUS_CHECK_FAILED';
    }

    const totalPaid = Number(orderDetails.amountPaid || 2358.82);

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
      // 1. Check if application or transaction was already created in a concurrent request
      let app = await prisma.application.findFirst({
        where: { transactionId: phonePeTxnId }
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
            transactionId: phonePeTxnId,
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
          where: { transactionId: phonePeTxnId }
        });

        if (!existingTxn) {
          await prisma.paymentTransaction.create({
            data: {
              applicationId: app.id,
              transactionId: phonePeTxnId,
              studentName: app.studentName,
              email: app.email,
              phone: app.phone,
              collegeName: app.collegeName,
              programTitle: app.programTitle,
              amountPaid: totalPaid,
              baseAmount,
              gstAmount,
              paymentStatus: 'Paid',
              paymentMethod: 'PhonePe Gateway (UPI/QR/Cards)',
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

      pendingOrders.delete(merchantTransactionId);

      return res.status(200).json({
        success: true,
        message: 'Payment Verified & Application Saved Successfully',
        data: emailPayload
      });
    } else {
      console.log(`[PhonePe Status Check] Transaction ${merchantTransactionId} failed/cancelled (${paymentCode}). Skipping DB record creation.`);
      pendingOrders.delete(merchantTransactionId);

      return res.status(200).json({
        success: false,
        paymentStatus: 'Failed',
        paymentCode: paymentCode,
        error: `Payment was declined or cancelled on PhonePe (${paymentCode})`,
        merchantTransactionId: merchantTransactionId,
        programTitle: orderDetails.programTitle,
        collegeName: orderDetails.collegeName,
        amountPaid: orderDetails.amountPaid
      });
    }
  } catch (error) {
    console.error('[PhonePe Status Verification Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify PhonePe payment status'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentStatus
};
