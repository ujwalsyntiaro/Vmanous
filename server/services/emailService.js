const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { generatePassPDF } = require('./pdfPassService');

// Cached Persistent Transporter with Connection Pooling for Ultra-Fast Delivery
let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '465', 10);
  const user = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  if (host) {
    cachedTransporter = nodemailer.createTransport({
      pool: true,               // Connection pooling (keeps SMTP socket warm & open)
      maxConnections: 5,        // Up to 5 parallel connections
      maxMessages: 100,         // Reuse each connection for up to 100 emails
      host: host,
      port: port,
      secure: port === 465,     // true for 465 SSL
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 8000,
      greetingTimeout: 4000,
      socketTimeout: 12000
    });
  } else {
    cachedTransporter = nodemailer.createTransport({
      pool: true,
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return cachedTransporter;
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
    // 1. Generate QR Code Buffer
    const qrDataText = `=== VMANOUS WORKSHOP PASS ===
Pass ID: ${passId}
Participant: ${studentName}
Email: ${recipientEmail}
Mobile: ${phone}
Blood Group: ${bloodGroup}
College: ${collegeName}
Address: ${collegeAddress}
Degree: ${degree}
Specialization: ${branch}
Semester: ${semester}
Program: ${programTitle}
Timing: ${timingStr}
Status: VERIFIED & PAID
Issued On: ${eventDateStr}
=============================`;

    const qrDataUrl = await QRCode.toDataURL(qrDataText, { width: 220, margin: 1 });
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    // 2. Generate Checkmark SVG Buffer for high-resolution email rendering
    const checkmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
  <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="none" />
  <path d="M 61 17 A 36 36 0 1 0 84 38" fill="none" stroke="#5cb85c" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 30 52 L 44 66 L 76 20" fill="none" stroke="#5cb85c" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;
    const checkmarkBuffer = Buffer.from(checkmarkSvg);

    // 3. Generate PDF Pass Attachment Buffer
    const pdfBuffer = await generatePassPDF(data);

    // 4. Build Email Attachments
    const emailAttachments = [
      {
        filename: `VMANOUS_Workshop_Pass_${passCode}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      },
      {
        filename: 'checkmark.png',
        content: checkmarkBuffer,
        contentType: 'image/svg+xml',
        cid: 'pass-checkmark'
      },
      {
        filename: 'qrcode.png',
        content: qrBuffer,
        contentType: 'image/png',
        cid: 'pass-qrcode'
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Workshop Pass</title>
        </head>
        <body style="margin: 0; padding: 20px 10px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <div style="max-width: 440px; margin: 0 auto;">
            
            <!-- Header Success Info -->
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="font-size: 19px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">Registration Successful!</h1>
              <p style="font-size: 13px; color: #64748b; margin: 0;">Your digital workshop pass has been generated.</p>
            </div>

            <!-- Main Pass Card Container -->
            <div style="background-color: #ffffff; border: 1px solid #000000; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 0; position: relative; margin-top: 25px;">
              
              <!-- Green Checkmark Icon (Centered on top border) -->
              <div style="text-align: center; margin-top: -28px; margin-bottom: 5px;">
                <img src="cid:pass-checkmark" width="56" height="56" alt="Success" style="display: inline-block; vertical-align: middle;" />
              </div>

              <!-- Top Pass Header: Payment Successful! & College Info -->
              <div style="padding: 4px 16px 8px 16px; text-align: center;">
                <h2 style="color: #5cb85c; font-size: 21px; font-weight: 600; margin: 0 0 8px 0; letter-spacing: -0.3px;">Payment Successful!</h2>
                <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #1e293b; margin: 0 0 3px 0; line-height: 1.3; letter-spacing: 0.5px;">${collegeName}</h3>
                <p style="font-size: 11px; font-weight: 600; color: #64748b; margin: 0 0 4px 0;">${collegeAddress}</p>
                <p style="font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; margin: 0;">${passId}</p>
              </div>

              <!-- Participant Profile & Info Section -->
              <div style="padding: 12px 16px; border-top: 1px solid #f1f5f9;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="vertical-align: top; text-align: left;">
                      <span style="display: inline-block; font-size: 10px; font-weight: 600; color: #059669; background-color: #ecfdf5; border: 1px solid #d1fae5; padding: 2px 8px; border-radius: 12px; margin-bottom: 6px;">
                        ${programTitle}
                      </span>
                      <h4 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">${studentName}</h4>
                      
                      <table style="border-collapse: collapse;">
                        <tr>
                          <td style="padding-right: 18px;">
                            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; display: block; text-transform: capitalize;">Mobile Number</span>
                            <span style="font-size: 11px; font-weight: 600; color: #334155;">${phone}</span>
                          </td>
                          <td>
                            <span style="font-size: 9px; font-weight: 700; color: #94a3b8; display: block; text-transform: capitalize;">Blood Group</span>
                            <span style="font-size: 11px; font-weight: 800; color: #0f172a;">${bloodGroup}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style="width: 85px; text-align: right; vertical-align: middle;">
                      ${avatarUrl ? `
                        <img src="${avatarUrl}" alt="${studentName}" width="78" height="78" style="border-radius: 50%; object-fit: cover; border: 2px solid #cbd5e1; display: block; margin-left: auto;" />
                      ` : `
                        <div style="width: 78px; height: 78px; border-radius: 50%; background-color: #f1f5f9; border: 2px solid #cbd5e1; text-align: center; line-height: 78px; display: inline-block; font-size: 24px; color: #94a3b8;">
                          👤
                        </div>
                      `}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Thin Center Divider Line -->
              <div style="height: 1px; background-color: #e2e8f0; width: 100%;"></div>

              <!-- Main Participant Academic Grid (3 Rounded Boxes) -->
              <div style="padding: 10px 16px;">
                <table style="width: 100%; border-collapse: separate; border-spacing: 6px 0;">
                  <tr>
                    <td style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 4px; text-align: center; width: 33%;">
                      <span style="font-size: 9px; color: #94a3b8; font-weight: 700; display: block;">Degree</span>
                      <span style="font-size: 11px; font-weight: 700; color: #1e293b; display: block; margin-top: 2px;">${degree}</span>
                    </td>
                    <td style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 4px; text-align: center; width: 33%;">
                      <span style="font-size: 9px; color: #94a3b8; font-weight: 700; display: block;">Specialization</span>
                      <span style="font-size: 10px; font-weight: 700; color: #1e293b; display: block; margin-top: 2px;">${branch}</span>
                    </td>
                    <td style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 4px; text-align: center; width: 33%;">
                      <span style="font-size: 9px; color: #94a3b8; font-weight: 700; display: block;">Semester</span>
                      <span style="font-size: 11px; font-weight: 700; color: #1e293b; display: block; margin-top: 2px;">${semester}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Ticket Dashed Tear Line with Notches -->
              <div style="position: relative; padding: 4px 0;">
                <div style="border-bottom: 2px dashed #000000; margin: 0 10px;"></div>
              </div>

              <!-- QR Code & Event Details Section -->
              <div style="padding: 12px 16px 16px 16px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="vertical-align: top; text-align: left;">
                      <div style="margin-bottom: 10px;">
                        <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                          📅 EVENT DATE
                        </span>
                        <span style="font-size: 12px; font-weight: 800; color: #0f172a;">${eventDateStr}</span>
                      </div>

                      <div style="margin-bottom: 12px;">
                        <span style="font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                          ⏰ WORKSHOP TIME
                        </span>
                        <span style="font-size: 12px; font-weight: 800; color: #0f172a;">${timingStr}</span>
                      </div>

                      <div>
                        <span style="display: inline-block; font-size: 9px; font-weight: 700; color: #047857; background-color: #d1fae5; border: 1px solid #a7f3d0; padding: 3px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                          ● OFFICIAL PASS
                        </span>
                      </div>
                    </td>

                    <!-- QR Code with Corner Brackets -->
                    <td style="width: 120px; text-align: right; vertical-align: middle;">
                      <div style="display: inline-block; padding: 4px; border: 1px solid #000000; border-radius: 4px; background: #ffffff;">
                        <img src="cid:pass-qrcode" width="112" height="112" alt="QR Code" style="display: block;" />
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

            </div>

            <!-- Footer Help Note -->
            <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 16px;">
              Please present this digital pass or the attached PDF pass at the campus auditorium gate on the event day.
            </p>

          </div>
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
 * Function to send Reschedule/Postponed Notification Email to Students
 */
const sendStudentRescheduleEmail = async (student, summitDetails, status, message) => {
  const transporter = getTransporter();
  const senderEmail = process.env.EMAIL_USER || 'vmanous.com@gmail.com';
  const recipientEmail = (student.email || '').trim();

  const mailOptions = {
    from: `"VMANOUS Academy" <${senderEmail}>`,
    to: recipientEmail,
    subject: `Update: Workshop ${status} - ${summitDetails.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #0B1B3D 0%, #1e3a8a 100%); padding: 20px; text-align: center; color: #ffffff; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Workshop ${status}</h2>
        </div>
        <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 15px; color: #334155;">Dear <strong>${student.studentName || 'Student'}</strong>,</p>
          <p style="font-size: 14px; color: #475569;">
            This is an important update regarding the <strong>${summitDetails.title}</strong> at <strong>${summitDetails.college}</strong>.
          </p>
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #1e293b;"><strong>New Schedule Details:</strong></p>
            <p style="margin: 0; font-size: 13px; color: #475569;">📅 Date: ${summitDetails.date || summitDetails.startDate}</p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #475569;">🕒 Time: ${summitDetails.time}</p>
          </div>
          ${message ? `<p style="font-size: 14px; color: #475569; padding: 10px; background-color: #fef3c7; border-radius: 4px;"><strong>Message from Organizer:</strong><br/>${message}</p>` : ''}
          <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
            We apologize for any inconvenience caused and look forward to seeing you.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error(`Failed to send reschedule email to ${recipientEmail}:`, err);
    return { success: false, error: err.message };
  }
};

module.exports = { 
  sendCollegeRequestEmail, 
  sendStudentPassEmail, 
  sendWorkshopCertificateEmail,
  sendAdminOtpEmail,
  sendStudentRescheduleEmail
};

