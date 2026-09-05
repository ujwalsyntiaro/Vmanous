const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { generatePassPDF } = require('./pdfPassService');

const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '465', 10);
  const user = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  if (host) {
    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465,     // true for 465 SSL
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 8000,
      greetingTimeout: 5000,
      socketTimeout: 15000
    });
  } else {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }
};

// Function to send College AI Summit Request Notification Email
const sendCollegeRequestEmail = async (data) => {
  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const recipientEmail = process.env.EMAIL_TO || senderEmail;

  const mailOptions = {
    from: `"VMANOUS College Requests" <${senderEmail}>`,
    to: recipientEmail,
    subject: `🚨 New College AI Summit Request: ${data.collegeName || 'Institution Request'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          🎓 New AI Workshop / Summit Proposal Request
        </h2>
        
        <p style="font-size: 14px; color: #475569;">
          A new college has submitted a request to host a VMANOUS AI Summit on their campus:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; width: 40%; color: #334155; border-bottom: 1px solid #e2e8f0;">College Name:</td>
            <td style="padding: 10px; color: #0f172a; border-bottom: 1px solid #e2e8f0;"><strong>${data.collegeName || 'N/A'}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0;">Campus Address / City:</td>
            <td style="padding: 10px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.collegeAddress || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0;">Representative Name:</td>
            <td style="padding: 10px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.repName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0;">Role / Designation:</td>
            <td style="padding: 10px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${data.repRole || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0;">Official Email:</td>
            <td style="padding: 10px; color: #2563eb; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${data.email}">${data.email || 'N/A'}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0;">Contact Number:</td>
            <td style="padding: 10px; color: #0f172a; border-bottom: 1px solid #e2e8f0;"><strong>${data.phone || 'N/A'}</strong></td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0;">WhatsApp Number:</td>
            <td style="padding: 10px; color: #059669; font-weight: bold; border-bottom: 1px solid #e2e8f0;"><strong>${data.whatsapp || 'N/A'}</strong></td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; color: #334155; border-bottom: 1px solid #e2e8f0;">Preferred Workshop Program:</td>
            <td style="padding: 10px; color: #059669; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${data.preferredProgram || 'N/A'}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 12px; background-color: #eff6ff; border-left: 4px solid #2563eb; font-size: 12px; color: #1e40af;">
          <strong>Action Required:</strong> Please contact the representative within 24 hours to schedule an initial consultation call.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${recipientEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Error sending email via Nodemailer:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Function to send Workshop Entry Pass Email with matching Pass Card and attached PDF
 * @param {Object} data - Application & Pass Data
 */
const sendStudentPassEmail = async (data) => {
  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const recipientEmail = data.email;

  if (!recipientEmail) {
    console.warn('[Pass Email Warning] No recipient email address provided.');
    return { success: false, error: 'No recipient email' };
  }

  const passId = data.transactionId || data.passCode || data.passId || 'T' + Date.now();
  const passCode = data.passCode || passId;
  const studentName = data.studentName || data.name || 'Participant';
  const collegeName = (data.collegeName || 'NATIONAL INSTITUTE OF TECHNOLOGY').toUpperCase();
  const rawAddress = data.venueLocation || data.collegeAddress || data.city || 'Main Campus Auditorium';
  const collegeAddress = rawAddress.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  const programTitle = data.programTitle || data.programInterest || 'AI Summit Workshop 2026';
  const degree = data.degree || 'B.Tech';
  const branch = data.branch || data.specialization || 'Computer Science';
  const semester = data.year || data.semester || '3rd Year';
  const bloodGroup = data.bloodGroup || 'O+';
  const phone = data.phone || data.mobileNumber || 'N/A';

  const bookingDate = data.createdAt ? new Date(data.createdAt) : new Date();
  const eventDateStr = data.eventDate || data.startDate
    ? new Date(data.eventDate || data.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
    : bookingDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const timingStr = data.timing || data.workshopTime || '10:00 AM - 04:00 PM';

  console.log(`[Pass Email Dispatch] Sending Pass Card email to ${recipientEmail} with Transaction ID: ${passId}...`);

  try {
    // 1. Generate PDF Pass Attachment Buffer
    const pdfBuffer = await generatePassPDF(data);

    // 2. Build Email Attachments (Only PDF)
    const emailAttachments = [
      {
        filename: `VMANOUS_Workshop_Pass_${data.passCode || data.transactionId || 'Entry'}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ];

    const avatarUrl = data.selfiePhotoUrl || data.selfie || null;

    // 5. Configure Email HTML matching Pass.jsx design exactly
    const mailOptions = {
      from: `"VMANOUS Team" <${senderEmail}>`,
      to: recipientEmail,
      subject: `Registration Successful | ${programTitle} – ${collegeName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          
          <p>Dear ${studentName},</p>
          <p>Greetings from the VMANOUS Team!</p>
          <p>We are pleased to confirm your seat booking for ${programTitle}, scheduled to be held at ${collegeName}.</p>
          
          <p>
            <strong>Booking Date & Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'long', timeStyle: 'short' })}<br>
            <strong>Payment:</strong> ₹${data.amount || '1'}
          </p>

          <p><strong>Event Details:</strong><br>
          <strong>Participant Name:</strong> ${studentName}<br>
          <strong>College/Institute:</strong> ${collegeName}<br>
          <strong>Event:</strong> ${programTitle}<br>
          <strong>Event Date:</strong> ${eventDateStr}<br>
          <strong>Event Time:</strong> ${timingStr}</p>
          
          <p>Your payment of ₹${data.amount || '1'} has been successfully received, and your seat has been reserved for the event.</p>
          
          <p>Please make sure to carry your registration/booking confirmation Pass on the day of the event.</p>
          
          <p>We look forward to welcoming you to ${programTitle} at ${collegeName} and hope you have an insightful and rewarding experience.</p>
          
          <p>Best Regards,<br>
          <strong>VMANOUS Team</strong></p>
          
        </body>
        </html>
      `,
      attachments: emailAttachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Pass Email Success] Full HTML Pass email dispatched to ${recipientEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Pass Email Error] Failed to send HTML pass email:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Function to send Workshop Certificate of Completion Email with attached PDF Certificate
 * @param {Object} data - Student & Certificate Data
 */
const sendWorkshopCertificateEmail = async (data) => {

  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const recipientEmail = (data.email || '').trim();

  // Basic email syntax validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!recipientEmail || !emailRegex.test(recipientEmail)) {
    console.warn('[Certificate Email Error] Invalid or missing student email address:', recipientEmail);
    return { success: false, error: 'Invalid Gmail address / Format error' };
  }

  const studentName = data.studentName || data.name || 'Participant';
  const collegeName = data.collegeName || 'National Institute of Technology';
  const workshopTitle = data.workshopTitle || data.programTitle || 'AI & Machine Learning Workshop';
  const certificateCode = data.certificateCode || `VM-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = data.workshopDate || data.eventDate || 'August 2026';

  console.log(`[Certificate Email Dispatch] Sending Certificate email to ${recipientEmail} for student ${studentName}...`);

  try {
    const emailAttachments = [];

    if (data.pdfBuffer) {
      emailAttachments.push({
        filename: `VMANOUS_Certificate_${studentName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        content: data.pdfBuffer,
        contentType: 'application/pdf'
      });
    }

    const mailOptions = {
      from: `"VMANOUS Academy" <${senderEmail}>`,
      to: recipientEmail,
      subject: `🎓 Certificate of Completion | ${workshopTitle} – ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Workshop Certificate</title>
        </head>
        <body style="margin: 0; padding: 24px 10px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Gold & Blue Header Banner -->
            <div style="background: linear-gradient(135deg, #0B1B3D 0%, #1e3a8a 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
              <p style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #C59B27; margin: 0 0 6px 0;">
                ⚡ VMANOUS ACADEMY OF ARTIFICIAL INTELLIGENCE
              </p>
              <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: 0.5px;">
                Certificate of Completion
              </h1>
              <p style="font-size: 13px; color: #cbd5e1; margin: 0;">
                Official Digital Credential & Verification
              </p>
            </div>

            <!-- Body Content -->
            <div style="padding: 28px 24px;">
              <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0;">
                Dear <strong>${studentName}</strong>,
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Congratulations! We are pleased to issue your official <strong>Certificate of Completion</strong> for actively participating in and completing the intensive hands-on workshop:
              </p>

              <!-- Highlight Box -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #C59B27; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <p style="font-size: 15px; font-weight: 700; color: #0F172A; margin: 0 0 6px 0;">
                  ${workshopTitle}
                </p>
                <p style="font-size: 13px; color: #64748B; margin: 0 0 4px 0;">
                  🏛️ <strong>Venue / College:</strong> ${collegeName}
                </p>
                <p style="font-size: 13px; color: #64748B; margin: 0 0 4px 0;">
                  📅 <strong>Date:</strong> ${dateStr}
                </p>
                <p style="font-size: 12px; font-weight: 700; color: #2563EB; margin: 6px 0 0 0;">
                  🆔 <strong>Certificate ID:</strong> ${certificateCode}
                </p>
              </div>

              <p style="font-size: 13px; color: #475569; line-height: 1.5; margin: 0 0 20px 0;">
                Your verified PDF certificate is attached directly to this email. You can download, print, or attach it to your LinkedIn profile and resume.
              </p>

              <div style="text-align: center; margin: 24px 0;">
                <span style="display: inline-block; background-color: #0B1B3D; color: #ffffff; padding: 10px 24px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none;">
                  ✓ Verified by VMANOUS Certification Authority
                </span>
              </div>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px 0;" />

              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
                This is an automated certification email. For any queries, please reach out to support@vmanous.com.
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
      attachments: emailAttachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Certificate Email Success] Certificate email dispatched to ${recipientEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId, certificateCode };
  } catch (err) {
    console.error('[Certificate Email Error] Failed to send certificate email:', err.message);
    let errMsg = 'Mail not delivered / SMTP Error';
    if (err.message.includes('Invalid login') || err.message.includes('auth')) {
      errMsg = 'Mail server authentication issue';
    } else if (err.message.includes('recipient') || err.message.includes('No recipients') || err.message.includes('550') || err.message.includes('mailbox')) {
      errMsg = 'Mail not delivered / Invalid Gmail';
    } else {
      errMsg = `Mail not delivered: ${err.message.slice(0, 50)}`;
    }
    return { success: false, error: errMsg };
  }
};

module.exports = { sendCollegeRequestEmail, sendStudentPassEmail, sendWorkshopCertificateEmail };

/**
 * Function to send OTP Email to Admin for Preponed/Reschedule/Postpone Verification
 */
const sendAdminOtpEmail = async (otp, summitDetails = {}, email = 'am@vmanous.com') => {
  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const recipientEmail = (email || 'am@vmanous.com').trim();
  const actionStatus = summitDetails.scheduleStatus || summitDetails.status || 'Schedule Change';

  const mailOptions = {
    from: `"VMANOUS Security" <${senderEmail}>`,
    to: recipientEmail,
    subject: `🔐 Security OTP: Authorize Workshop ${actionStatus} (${summitDetails.title || 'Summit'})`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(135deg, #0B1B3D 0%, #1e3a8a 100%); padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
            🔐 VMANOUS Admin Security Authorization
          </h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">Workshop ${actionStatus} Request</p>
        </div>
        
        <div style="padding: 24px 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 14px; color: #334155; margin-top: 0;">
            An administrative request has been made to mark the workshop as <strong>${actionStatus}</strong>.
          </p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 16px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #1e293b;"><strong>Workshop:</strong> ${summitDetails.title || 'AI Summit'}</p>
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #1e293b;"><strong>College / Venue:</strong> ${summitDetails.college || 'Partner Institution'}</p>
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #1e293b;"><strong>New Date:</strong> ${summitDetails.date || summitDetails.startDate || 'N/A'}</p>
            <p style="margin: 0; font-size: 13px; color: #1e293b;"><strong>Timing:</strong> ${summitDetails.time || 'N/A'}</p>
          </div>

          <p style="font-size: 13px; color: #475569; text-align: center; margin-bottom: 8px;">
            Enter the 6-digit One-Time Password (OTP) in the VPanel modal to authorize this update:
          </p>

          <div style="margin: 18px 0; text-align: center;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1e3a8a; background-color: #eff6ff; border: 2px dashed #93c5fd; padding: 12px 28px; border-radius: 10px; display: inline-block; font-family: monospace;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 10px 0 0 0;">
            ⏳ This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />

          <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
            If you did not initiate this change in the VMANOUS VPanel, please secure your account immediately.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Admin OTP] Sent successfully to ${recipientEmail}:`, info.messageId);
    return { success: true };
  } catch (err) {
    console.error(`[Admin OTP Error] Failed to send Admin OTP to ${recipientEmail}:`, err);
    return { success: false, error: err.message };
  }
};

/**
 * Function to send Security Email Change Authorization OTP to Current Admin Email
 */
const sendSecurityEmailChangeOtpEmail = async (otp, newEmail, currentEmail = 'am@vmanous.com') => {
  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const recipientEmail = (currentEmail || 'am@vmanous.com').trim();

  const mailOptions = {
    from: `"VMANOUS Root Security" <${senderEmail}>`,
    to: recipientEmail,
    subject: `🚨 CRITICAL ALERT: Request to Change Authorized Webmail to ${newEmail}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%); padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
            🚨 Security Alert: Change of Authorized Webmail
          </h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Dual-Factor Handshake Verification</p>
        </div>
        
        <div style="padding: 24px 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 14px; color: #334155; margin-top: 0;">
            A request has been initiated in the VPanel to change the primary <strong>Authorized Webmail</strong> for security OTPs and schedule approvals.
          </p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0 0 6px 0; font-size: 13px; color: #7f1d1d;"><strong>Current Authorized Mail:</strong> ${currentEmail}</p>
            <p style="margin: 0; font-size: 13px; color: #991b1b;"><strong>Proposed New Authorized Mail:</strong> <span style="background-color: #fee2e2; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${newEmail}</span></p>
          </div>

          <p style="font-size: 13px; color: #475569; text-align: center; margin-bottom: 8px;">
            If you authorized this change, enter the following 6-digit confirmation code in VPanel:
          </p>

          <div style="margin: 18px 0; text-align: center;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #991b1b; background-color: #fff1f2; border: 2px dashed #f87171; padding: 12px 28px; border-radius: 10px; display: inline-block; font-family: monospace;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 12px; color: #dc2626; font-weight: bold; text-align: center; margin: 10px 0 0 0;">
            ⚠️ If you did NOT initiate this request, DO NOT share this code and contact security immediately.
          </p>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />

          <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
            Protected by VMANOUS Enterprise Security Gateway. Valid for 10 minutes.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Security Change OTP] Sent successfully to ${recipientEmail}:`, info.messageId);
    return { success: true };
  } catch (err) {
    console.error(`[Security Change OTP Error] Failed to send to ${recipientEmail}:`, err);
    return { success: false, error: err.message };
  }
};

/**
 * Function to send Reschedule/Postponed/Preponed Notification Email to Enrolled Students
 */
const sendStudentRescheduleEmail = async (student, summitDetails, status, message) => {
  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const recipientEmail = (student.email || '').trim();

  if (!recipientEmail) return { success: false, error: 'No recipient email' };

  const action = (status || 'Rescheduled').trim();
  const isPreponed = action.toLowerCase() === 'preponed';
  const isPostponed = action.toLowerCase() === 'postponed';

  // Dynamic Theme Colors & Icons
  let headerGradient = 'linear-gradient(135deg, #0B1B3D 0%, #1e3a8a 100%)';
  let badgeColor = '#2563eb';
  let subjectPrefix = '📅 Important Update: Workshop Rescheduled';
  let noticeText = 'Your workshop has been rescheduled. Please find the revised confirmed dates and schedule below.';

  if (isPreponed) {
    headerGradient = 'linear-gradient(135deg, #064e3b 0%, #059669 100%)';
    badgeColor = '#059669';
    subjectPrefix = '⚡ Urgent Notice: Workshop Preponed';
    noticeText = 'Your workshop has been preponed to an earlier date. Please mark the new dates on your calendar.';
  } else if (isPostponed) {
    headerGradient = 'linear-gradient(135deg, #881337 0%, #e11d48 100%)';
    badgeColor = '#e11d48';
    subjectPrefix = '⏳ Important Notice: Workshop Postponed';
    noticeText = 'Your workshop has been postponed. Please review the updated schedule details below.';
  }

  const newDate = summitDetails.date || summitDetails.startDate || 'N/A';
  const timing = summitDetails.time || '10:00 AM - 05:00 PM';
  const venue = summitDetails.college || 'College Campus';
  const address = summitDetails.address ? ` (${summitDetails.address})` : '';
  const studentName = student.studentName || student.name || 'Participant';
  const passCode = student.passCode || 'VERIFIED-PASS';

  const mailOptions = {
    from: `"VMANOUS Academy" <${senderEmail}>`,
    to: recipientEmail,
    subject: `${subjectPrefix} - ${summitDetails.title || 'AI Summit Workshop'}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <!-- Header Banner -->
        <div style="background: ${headerGradient}; padding: 24px 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
          <div style="display: inline-block; padding: 4px 14px; border-radius: 20px; background-color: rgba(255, 255, 255, 0.2); font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">
            Schedule Update Alert
          </div>
          <h2 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">
            Workshop ${action}
          </h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;">${summitDetails.title || 'AI Summit Workshop'}</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 24px 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 15px; color: #1e293b; margin-top: 0;">
            Dear <strong>${studentName}</strong>,
          </p>
          <p style="font-size: 14px; color: #475569; line-height: 1.5;">
            ${noticeText}
          </p>
          
          <!-- Schedule Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid ${badgeColor}; padding: 16px 18px; margin: 20px 0; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600; width: 35%;">🏫 Venue:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${venue}${address}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">📅 New Date:</td>
                <td style="padding: 6px 0; color: ${badgeColor}; font-weight: 800; font-size: 14px;">${newDate}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">🕒 Time:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${timing}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">🎟️ Your Pass Code:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700; font-family: monospace;">${passCode}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: #475569; line-height: 1.5;">
            Your registration and confirmed entry pass remain <strong>100% valid</strong> for this revised schedule. You do not need to register again.
          </p>

          <div style="margin-top: 24px; padding: 14px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #475569; text-align: center;">
            Need assistance or have queries? Contact us at <a href="mailto:support@vmanous.com" style="color: #2563eb; font-weight: bold; text-decoration: none;">support@vmanous.com</a>
          </div>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0 16px 0;" />

          <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
            © ${new Date().getFullYear()} VMANOUS Academy. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Student Reschedule Alert] Sent successfully to ${recipientEmail}:`, info.messageId);
    return { success: true };
  } catch (err) {
    console.error(`[Student Reschedule Alert Error] Failed to send to ${recipientEmail}:`, err);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendCollegeRequestEmail,
  sendStudentPassEmail,
  sendWorkshopCertificateEmail,
  sendAdminOtpEmail,
  sendSecurityEmailChangeOtpEmail,
  sendStudentRescheduleEmail
};

