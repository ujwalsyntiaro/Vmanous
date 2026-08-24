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

    const now = new Date();
    const bookingDateTime = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) + ',  ' + now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const eventTitle = data.programTitle || 'AI Submit 2026';
    const collegeName = data.collegeName || 'IIT Patna';
    const eventDate = data.eventDate || data.startDate ? new Date(data.eventDate || data.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '10 September 2026';
    const eventTime = data.timing || data.time || '10:00 AM to 6:00 PM';
    const totalAmount = data.amountPaid ? `₹${Number(data.amountPaid).toLocaleString('en-IN')}` : '₹2,499';

    // 2. Configure Email Options with Exact Requested User Pattern
    const mailOptions = {
      from: `"VMANOUS Team" <${senderEmail}>`,
      to: recipientEmail,
      subject: `Seat Booking Confirmed - ${eventTitle} at ${collegeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #222222; line-height: 1.5; font-size: 14px; max-width: 600px; padding: 10px;">
          <p style="margin: 0 0 14px 0;">Dear ${studentName},</p>

          <p style="margin: 0 0 14px 0;">Greetings from the VMANOUS Team!</p>

          <p style="margin: 0 0 14px 0;">We are pleased to confirm your seat booking for ${eventTitle}, scheduled to be held at ${collegeName}.</p>

          <p style="margin: 0 0 14px 0;">Event Details:</p>

          <p style="margin: 0 0 4px 0;">Participant Name: ${studentName}</p>
          <p style="margin: 0 0 4px 0;">College/Institute: ${collegeName}</p>
          <p style="margin: 0 0 14px 0;">Event: ${eventTitle}</p>

          <p style="margin: 0 0 4px 0;">Date: ${eventDate}</p>
          <p style="margin: 0 0 4px 0;">Time: ${eventTime}</p>
          <p style="margin: 0 0 4px 0;">Payment Received: ${totalAmount}</p>
          <p style="margin: 0 0 14px 0;">Booking Date & Time: ${bookingDateTime}</p>

          <p style="margin: 0 0 14px 0;">Your payment of ${totalAmount} has been successfully received, and your seat has been reserved for the event.</p>

          <p style="margin: 0 0 14px 0;">Please make sure to carry your registration/booking confirmation Pass on the day of the event.</p>

          <p style="margin: 0 0 14px 0;">We look forward to welcoming you to ${eventTitle} at ${collegeName} and hope you have an insightful and rewarding experience.</p>

          <p style="margin: 20px 0 4px 0;">Best Regards,</p>
          <p style="margin: 0 0 2px 0;">${eventTitle} Team</p>
          <p style="margin: 0;">VMANOUS</p>
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
