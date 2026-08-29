const prisma = require('../config/prisma');
const { generateCertificatePDF } = require('../services/certificatePdfService');
const { sendWorkshopCertificateEmail } = require('../services/emailService');

// Helper to extract year and month strings
const parseDateParts = (dateStr) => {
  if (!dateStr) return { year: null, month: null, day: null, fullDate: null };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { year: null, month: null, day: null, fullDate: null };
  return {
    year: d.getFullYear().toString(),
    month: (d.getMonth() + 1).toString().padStart(2, '0'), // '01' to '12'
    monthName: d.toLocaleString('en-US', { month: 'short' }), // 'Jan', 'Aug'
    day: d.getDate().toString().padStart(2, '0'),
    fullDate: d.toISOString().split('T')[0] // '2026-08-24'
  };
};

/**
 * Get all workshops with college details, enrolled student counts, and certificate status
 */
const getWorkshops = async (req, res) => {
  try {
    const { year, month, date } = req.query;

    const summits = await prisma.summit.findMany({
      include: {
        applications: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Also fetch certificate records if available
    let certificates = [];
    try {
      certificates = await prisma.$queryRaw`SELECT * FROM Certificate`;
    } catch (e) {
      // Table might be queried directly or via prisma
      try {
        certificates = await prisma.certificate.findMany();
      } catch (err) {}
    }

    const certMap = new Map();
    certificates.forEach(c => {
      if (c.applicationId) certMap.set(c.applicationId, c);
    });

    const enrichedWorkshops = summits.map(summit => {
      const paidApps = (summit.applications || []).filter(a => a.paymentStatus === 'Paid');
      const enrolledCount = paidApps.length;
      const capacity = summit.seatCapacity || 100;
      const isSeatsFull = enrolledCount >= capacity || summit.status === 'Sold Out' || summit.status === 'Full';

      let sentCount = 0;
      let failedCount = 0;
      paidApps.forEach(app => {
        const cert = certMap.get(app.id);
        if (cert) {
          if (cert.status === 'Sent') sentCount++;
          if (cert.status === 'Failed') failedCount++;
        }
      });

      // Parse date for flexible filtering
      const eventDateRaw = summit.startDate || summit.date || summit.createdAt;
      const dateParts = parseDateParts(eventDateRaw);

      return {
        id: summit.id,
        title: summit.title,
        subtitle: summit.subtitle,
        college: summit.college,
        address: summit.address,
        seatCapacity: capacity,
        enrolledCount,
        isSeatsFull,
        status: summit.status,
        date: summit.date || summit.startDate,
        startDate: summit.startDate,
        endDate: summit.endDate,
        time: summit.time,
        price: summit.price,
        dateParts,
        certificates: {
          totalEligible: enrolledCount,
          sentCount,
          failedCount,
          pendingCount: Math.max(0, enrolledCount - sentCount)
        }
      };
    });

    res.json({
      success: true,
      data: enrichedWorkshops
    });
  } catch (error) {
    console.error('Error fetching workshops for certificates:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * Get all enrolled students for a specific college workshop
 */
const getWorkshopStudents = async (req, res) => {
  try {
    const { summitId } = req.params;

    const summit = await prisma.summit.findUnique({
      where: { id: parseInt(summitId, 10) }
    });

    if (!summit) {
      return res.status(404).json({ success: false, error: 'Workshop not found' });
    }

    const applications = await prisma.application.findMany({
      where: {
        summitId: parseInt(summitId, 10),
        paymentStatus: 'Paid'
      },
      orderBy: { createdAt: 'asc' }
    });

    // Query certificate records
    let certificates = [];
    try {
      certificates = await prisma.$queryRaw`SELECT * FROM Certificate WHERE applicationId IN (${prisma.raw(applications.map(a => `'${a.id}'`).join(',') || "''")})`;
    } catch (e) {
      try {
        certificates = await prisma.certificate.findMany({
          where: { applicationId: { in: applications.map(a => a.id) } }
        });
      } catch (err) {}
    }

    const certMap = new Map();
    certificates.forEach(c => certMap.set(c.applicationId, c));

    const students = applications.map(app => {
      const cert = certMap.get(app.id);
      return {
        id: app.id,
        applicationId: app.id,
        studentName: app.studentName,
        email: app.email,
        phone: app.phone,
        collegeName: app.collegeName,
        branch: app.branch || 'Computer Science',
        year: app.year || '3rd Year',
        passCode: app.passCode,
        paymentStatus: app.paymentStatus,
        createdAt: app.createdAt,
        certificate: cert ? {
          id: cert.id,
          certificateCode: cert.certificateCode,
          status: cert.status, // "Sent", "Failed", "Pending"
          errorMessage: cert.errorMessage,
          sentAt: cert.sentAt
        } : {
          certificateCode: `VM-CERT-${new Date().getFullYear()}-${app.id.slice(0, 4).toUpperCase()}`,
          status: 'Pending',
          errorMessage: null,
          sentAt: null
        }
      };
    });

    res.json({
      success: true,
      summit: {
        id: summit.id,
        title: summit.title,
        college: summit.college,
        address: summit.address,
        date: summit.date || summit.startDate,
        startDate: summit.startDate,
        seatCapacity: summit.seatCapacity,
        totalEnrolled: applications.length
      },
      data: students
    });
  } catch (error) {
    console.error('Error fetching workshop students:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

/**
 * Bulk send certificates to selected students
 */
const sendBulkCertificates = async (req, res) => {
  try {
    const { studentIds, summitId } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No students selected' });
    }

    const applications = await prisma.application.findMany({
      where: {
        id: { in: studentIds }
      },
      include: { summit: true }
    });

    const results = [];

    for (const app of applications) {
      const certCode = `VM-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const certData = {
        studentName: app.studentName,
        email: app.email,
        collegeName: (app.summit && app.summit.college) || app.collegeName,
        workshopTitle: (app.summit && app.summit.title) || app.programTitle,
        workshopDate: (app.summit && (app.summit.date || app.summit.startDate)) || 'August 2026',
        certificateCode: certCode
      };

      try {
        // 1. Generate PDF
        const pdfBuffer = await generateCertificatePDF(certData);

        // 2. Dispatch Email
        const emailRes = await sendWorkshopCertificateEmail({
          ...certData,
          pdfBuffer
        });

        const status = emailRes.success ? 'Sent' : 'Failed';
        const errorMessage = emailRes.success ? null : (emailRes.error || 'Mail not delivered / Invalid Gmail');
        const sentAt = emailRes.success ? new Date() : null;

        // 3. Persist certificate record
        try {
          await prisma.$executeRaw`
            INSERT INTO Certificate (id, certificateCode, applicationId, studentName, email, collegeName, workshopTitle, workshopDate, status, errorMessage, sentAt, createdAt, updatedAt)
            VALUES (UUID(), ${certCode}, ${app.id}, ${app.studentName}, ${app.email}, ${certData.collegeName}, ${certData.workshopTitle}, ${certData.workshopDate}, ${status}, ${errorMessage}, ${sentAt}, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
              status = ${status},
              errorMessage = ${errorMessage},
              sentAt = ${sentAt},
              updatedAt = NOW()
          `;
        } catch (dbErr) {
          console.warn('Certificate DB write warning:', dbErr.message);
        }

        results.push({
          applicationId: app.id,
          studentName: app.studentName,
          email: app.email,
          success: emailRes.success,
          status,
          errorMessage,
          certificateCode: certCode,
          sentAt
        });
      } catch (err) {
        results.push({
          applicationId: app.id,
          studentName: app.studentName,
          email: app.email,
          success: false,
          status: 'Failed',
          errorMessage: `Mail not delivered: ${err.message}`,
          certificateCode: certCode,
          sentAt: null
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Processed ${results.length} certificates (${successCount} Sent, ${failedCount} Failed)`,
      successCount,
      failedCount,
      results
    });
  } catch (error) {
    console.error('Error in bulk certificate dispatch:', error);
    res.status(500).json({ success: false, error: 'Bulk dispatch failed' });
  }
};

/**
 * Preview / Download Dynamic Certificate PDF
 */
const previewCertificatePdf = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { summit: true }
    });

    if (!app) {
      return res.status(404).json({ success: false, error: 'Student application not found' });
    }

    const certData = {
      studentName: app.studentName,
      collegeName: (app.summit && app.summit.college) || app.collegeName,
      workshopTitle: (app.summit && app.summit.title) || app.programTitle,
      workshopDate: (app.summit && (app.summit.date || app.summit.startDate)) || 'August 2026',
      certificateCode: `VM-CERT-${new Date().getFullYear()}-${app.id.slice(0, 4).toUpperCase()}`
    };

    const pdfBuffer = await generateCertificatePDF(certData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="Certificate_${app.studentName.replace(/\s+/g, '_')}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error previewing certificate PDF:', error);
    res.status(500).json({ success: false, error: 'PDF Generation failed' });
  }
};

module.exports = {
  getWorkshops,
  getWorkshopStudents,
  sendBulkCertificates,
  previewCertificatePdf
};
