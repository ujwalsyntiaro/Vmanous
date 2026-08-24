const prisma = require('../config/prisma');

// Get all applications with financial metrics summary
const getApplications = async (req, res) => {
  try {
    const { range, startDate, endDate, collegeName } = req.query;
    let whereClause = {};

    if (collegeName) {
      whereClause.collegeName = { contains: collegeName };
    }

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    } else if (range && range !== 'all') {
      const now = new Date();
      let cutOff = new Date();
      if (range === '7d') cutOff.setDate(now.getDate() - 7);
      else if (range === '1m') cutOff.setDate(now.getDate() - 30);
      else if (range === '3m') cutOff.setDate(now.getDate() - 90);
      else if (range === '6m') cutOff.setDate(now.getDate() - 180);
      else if (range === 'ytd') cutOff = new Date(now.getFullYear(), 0, 1);

      whereClause.createdAt = { gte: cutOff };
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { summit: true }
    });

    const transactions = await prisma.paymentTransaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate revenue & GST metrics for the filtered period
    const paidApps = applications.filter(a => a.paymentStatus === 'Paid');
    const grossRevenue = paidApps.reduce((sum, a) => sum + (a.amountPaid || 0), 0);
    const baseRevenue = paidApps.reduce((sum, a) => sum + (a.baseAmount || (a.amountPaid / 1.18)), 0);
    const gstCollected = grossRevenue - baseRevenue;
    const platformFeeCollected = paidApps.reduce((sum, a) => sum + (a.platformFee || 50), 0);
    const totalPaidCount = paidApps.length;
    const failedCount = applications.filter(a => a.paymentStatus === 'Failed').length;
    const pendingAuditCount = applications.filter(a => a.verificationStatus === 'Pending Audit').length;

    res.json({
      success: true,
      data: applications,
      transactions,
      financialMetrics: {
        grossRevenue: Number(grossRevenue.toFixed(2)),
        baseRevenue: Number(baseRevenue.toFixed(2)),
        gstCollected: Number(gstCollected.toFixed(2)),
        platformFeeCollected: Number(platformFeeCollected.toFixed(2)),
        aov: totalPaidCount > 0 ? Number((grossRevenue / totalPaidCount).toFixed(2)) : 0,
        totalPaidCount,
        failedCount,
        pendingAuditCount
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Create new student application & save payment transaction history (Success & Failed)
const createApplication = async (req, res) => {
  try {
    const {
      studentName,
      email,
      phone,
      collegeName,
      venueLocation,
      branch,
      year,
      degree,
      marksTenth,
      marksTwelfth,
      selfiePhotoUrl,
      programTitle,
      summitId,
      amountPaid,
      platformFee,
      paymentStatus,
      paymentFailureReason,
      transactionId,
      passCode
    } = req.body;

    const status = paymentStatus || 'Paid';
    const isPaid = status === 'Paid';
    const totalPaid = isPaid ? Number(amountPaid || 2358.82) : 0;
    const baseAmount = isPaid ? Number((totalPaid / 1.18).toFixed(2)) : 0;
    const gstAmount = isPaid ? Number((totalPaid - baseAmount).toFixed(2)) : 0;
    const feeAmount = isPaid ? Number(platformFee || 50) : 0;
    const txnId = transactionId || `TXN_${isPaid ? '' : 'FAIL_'}${Math.floor(10000000 + Math.random() * 90000000)}`;
    const finalPassCode = isPaid ? (passCode || `PASS-${(collegeName || 'VM').slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`) : null;

    // Check if application with this transaction ID already exists
    const existing = await prisma.application.findFirst({
      where: { transactionId: txnId }
    });
    if (existing) {
      return res.status(200).json({ success: true, data: existing, message: 'Application already exists' });
    }

    // 1. Create Application Record
    const newApp = await prisma.application.create({
      data: {
        studentName,
        email,
        phone,
        collegeName,
        venueLocation,
        branch,
        year,
        degree,
        marksTenth: String(marksTenth || ''),
        marksTwelfth: String(marksTwelfth || ''),
        selfiePhotoUrl,
        programTitle,
        summitId: summitId ? Number(summitId) : null,
        paymentStatus: status,
        paymentFailureReason: isPaid ? null : (paymentFailureReason || 'Bank Server Timeout / Transaction Cancelled'),
        verificationStatus: isPaid ? 'Verified' : 'Pending Audit',
        transactionId: txnId,
        amountPaid: totalPaid,
        baseAmount,
        gstAmount,
        platformFee: feeAmount,
        passCode: finalPassCode
      }
    });

    // 2. Log in PaymentTransaction History table
    try {
      await prisma.paymentTransaction.create({
        data: {
          applicationId: newApp.id,
          transactionId: txnId,
          studentName,
          email,
          phone,
          collegeName,
          programTitle,
          amountPaid: totalPaid,
          baseAmount,
          gstAmount,
          platformFee: feeAmount,
          paymentStatus: status,
          paymentMethod: 'UPI / QR Code',
          paymentFailureReason: isPaid ? null : (paymentFailureReason || 'Bank Timeout'),
          passCode: finalPassCode
        }
      });
    } catch (txnErr) {
      console.warn('Payment transaction log notice:', txnErr.message);
    }

    res.status(201).json({ success: true, data: newApp });
  } catch (error) {
    console.error('Error creating application & payment transaction:', error);
    res.status(500).json({ success: false, error: 'Failed to record payment' });
  }
};

// Get all payment transactions history (Success & Failed)
const getPaymentTransactions = async (req, res) => {
  try {
    const transactions = await prisma.paymentTransaction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Update verification status
const updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;

    const updated = await prisma.application.update({
      where: { id },
      data: { verificationStatus }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ success: false, error: 'Update failed' });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.application.delete({ where: { id } });
    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
};

module.exports = {
  getApplications,
  createApplication,
  getPaymentTransactions,
  updateVerificationStatus,
  deleteApplication
};
