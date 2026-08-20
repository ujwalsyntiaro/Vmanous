const nodemailer = require('nodemailer');
const { generatePassPDF } = require('./pdfPassService');

// Configure Email Transporter (SMTP / Webmail / Gmail)
const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '465', 10);
  const user = process.env.EMAIL_USER || 'ujwal@syntiaro.com';
  const pass = process.env.EMAIL_PASS || '';

  if (host) {
    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465, // true for 465 SSL
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
};

// Function to send College AI Summit Request Notification Email
const sendCollegeRequestEmail = async (data) => {
  const transporter = createTransporter();
  const senderEmail = process.env.EMAIL_USER || 'ujwal@syntiaro.com';
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
 * Function to send Workshop Entry Pass Email with attached PDF Pass to Student
 * @param {Object} data - Application & Pass Data
 */
const sendStudentPassEmail = async (data) => {
  const transporter = createTransporter();
  const senderEmail = process.env.EMAIL_USER || 'kiran@vedhaai.in';
  const recipientEmail = data.email;

  if (!recipientEmail) {
    console.warn('[Pass Email Warning] No recipient email address provided.');
    return { success: false, error: 'No recipient email' };
  }

  const passCode = data.passCode || 'PASS-' + Math.floor(100000 + Math.random() * 900000);
  const studentName = data.studentName || 'Participant';

  console.log(`[Pass Email Dispatch] Sending PDF Pass to student inserted Gmail ID: ${recipientEmail}...`);

  try {
    // 1. Generate PDF Pass Attachment Buffer
    console.log(`[PDF Pass Generator] Generating PDF Pass for ${studentName} (${passCode})...`);
    const pdfBuffer = await generatePassPDF(data);

    // 2. Configure Email Options
    const mailOptions = {
      from: `"VMANOUS AI Workshop" <${senderEmail}>`,
      to: recipientEmail,
      subject: `🎟️ Your Workshop Entry Pass - ${passCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="color: #0f172a; margin: 0; font-size: 24px;">🎉 Workshop Registration Confirmed!</h1>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Thank you for enrolling in VMANOUS AI Summit & Workshop</p>
          </div>

          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #475569; padding-bottom: 12px; margin-bottom: 12px;">
              <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Official Entry Pass Attachment</span>
              <span style="background-color: #10b981; color: #ffffff; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: bold;">VERIFIED & PAID</span>
            </div>

            <h3 style="color: #38bdf8; margin: 0 0 10px 0; font-size: 18px;">${data.programTitle || 'AI SUMMIT WORKSHOP'}</h3>

            <div style="font-size: 14px; line-height: 1.6;">
              <p style="margin: 4px 0;">👤 <strong>Student Name:</strong> ${studentName}</p>
              <p style="margin: 4px 0;">🏫 <strong>College:</strong> ${data.collegeName || 'G H RAISONI'}</p>
              <p style="margin: 4px 0;">🎓 <strong>Degree / Branch:</strong> ${data.degree || 'B.Tech'} - ${data.branch || 'Engineering'}</p>
              <p style="margin: 4px 0;">📍 <strong>Venue Location:</strong> ${data.venueLocation || 'Campus Auditorium'}</p>
            </div>

            <div style="margin-top: 16px; padding: 12px; background-color: rgba(255,255,255,0.1); border-radius: 6px; text-align: center;">
              <span style="font-size: 11px; color: #94a3b8; display: block;">PASS CODE / GATE TICKET ID</span>
              <span style="font-size: 22px; font-weight: bold; color: #10b981; letter-spacing: 2px;">${passCode}</span>
            </div>
          </div>

          <div style="padding: 14px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 6px; font-size: 13px; color: #166534; margin-bottom: 20px;">
            📄 <strong>PDF Pass Attached:</strong> Your official printable PDF entry pass (with scannable QR Code) is attached to this email (<code>VMANOUS_Workshop_Pass_${passCode}.pdf</code>). Please present it at the entry desk on workshop day.
          </div>

          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            VMANOUS Academic Partnerships • Need Help? Email <a href="mailto:support@vmanous.com" style="color: #2563eb;">support@vmanous.com</a>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `VMANOUS_Workshop_Pass_${passCode}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Pass Email Success] PDF Pass email sent to ${recipientEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Pass Email Error] Failed to send PDF pass email:', err);
    return { success: false, error: err.message };
  }
};

module.exports = { sendCollegeRequestEmail, sendStudentPassEmail };
