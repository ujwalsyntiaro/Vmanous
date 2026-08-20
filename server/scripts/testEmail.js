require('dotenv').config();
const nodemailer = require('nodemailer');
const { generatePassPDF } = require('../services/pdfPassService');

const testSend = async () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '465', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const recipient = process.env.EMAIL_TO || user;

  console.log(`Testing SMTP with Host: ${host}, Port: ${port}, User: ${user}, Target: ${recipient}...`);

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const verified = await transporter.verify();
    console.log('Transporter verification success:', verified);

    const pdfBuffer = await generatePassPDF({
      studentName: 'Test Student',
      email: recipient,
      phone: '9876543210',
      collegeName: 'G H RAISONI',
      venueLocation: 'Campus Auditorium',
      programTitle: 'AI SUMMIT WORKSHOP 2030',
      degree: 'B.Tech',
      branch: 'Computer Science',
      year: '4th Semester',
      bloodGroup: 'B+',
      passCode: 'PASS-TEST-999'
    });

    console.log('Generated PDF Buffer size:', pdfBuffer.length, 'bytes');

    const info = await transporter.sendMail({
      from: `"VMANOUS AI Workshop" <${user}>`,
      to: recipient,
      subject: '🎟️ TEST WORKSHOP PASS EMAIL',
      html: '<h1>Test Email for Pass Delivery</h1><p>Find PDF attached.</p>',
      attachments: [
        {
          filename: 'VMANOUS_Test_Pass.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    console.log('Email sent successfully! MessageId:', info.messageId);
  } catch (err) {
    console.error('SMTP Delivery Error:', err);
  }
};

testSend();
