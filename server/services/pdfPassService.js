const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const axios = require('axios');

/**
 * Safely fetches or converts photo input to Node Buffer
 */
const getPhotoBuffer = async (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return null;
  try {
    if (urlStr.startsWith('data:image')) {
      const parts = urlStr.split(',');
      if (parts[1]) {
        return Buffer.from(parts[1].trim(), 'base64');
      }
    } else if (urlStr.startsWith('http://') || urlStr.startsWith('https://')) {
      const response = await axios.get(urlStr, { responseType: 'arraybuffer', timeout: 5000 });
      return Buffer.from(response.data);
    } else if (urlStr.length > 100) {
      // Raw base64 string without data prefix
      return Buffer.from(urlStr.trim(), 'base64');
    }
  } catch (err) {
    console.warn('[PDF Generator] Image buffer fetch warning:', err.message);
  }
  return null;
};

/**
 * Generates an in-memory PDF Buffer for the Workshop Entry Pass matching Pass.jsx design (Image 2)
 * @param {Object} data - Application & Pass details
 * @returns {Promise<Buffer>} - Resolves to PDF File Buffer
 */
const generatePassPDF = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [360, 560], // Ticket Badge Dimensions
        margin: 15
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const passId = data.passCode || data.transactionId || 'T2608201407180834378858';
      const studentName = data.studentName || 'Participant';
      const collegeName = (data.collegeName || 'KDK').toUpperCase();
      const collegeAddress = data.venueLocation || 'Sakardhara';
      const programTitle = data.programTitle || 'Workshop Aegentic ai';
      const degree = data.degree || 'MCA';
      const branch = data.branch || 'Data Science & Analytics';
      const semester = data.year || data.semester || '2nd Semester';
      const bloodGroup = data.bloodGroup || 'B-';
      const phone = data.phone || '8569841230';
      const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      // 1. Fetch QR Code Buffer
      const qrDataText = `=== VMANOUS WORKSHOP PASS ===\nPass ID: ${passId}\nParticipant: ${studentName}\nEmail: ${data.email || 'N/A'}\nMobile: ${phone}\nCollege: ${collegeName}\nStatus: VERIFIED & PAID`;
      const qrDataUrl = await QRCode.toDataURL(qrDataText, { width: 120, margin: 1 });
      const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

      // 2. Fetch Student Photo Buffer
      const photoBuffer = await getPhotoBuffer(data.selfiePhotoUrl);

      // 3. Card Background & Outer Border
      doc.save();
      doc.roundedRect(10, 10, 340, 540, 12)
         .lineWidth(1)
         .strokeColor('#e2e8f0')
         .fillAndStroke('#ffffff', '#e2e8f0');
      doc.restore();

      // 4. Top-Left Circular "Payment Successful" Ink Seal Badge (Image 2 Replica)
      const sealX = 52;
      const sealY = 52;

      doc.save();
      // Outer Seal Ring
      doc.circle(sealX, sealY, 32).lineWidth(1.8).strokeColor('#047857').stroke();
      // Inner Seal Ring
      doc.circle(sealX, sealY, 25).lineWidth(1.2).strokeColor('#047857').stroke();

      // Top Circular Arc Label
      doc.font('Helvetica-Bold').fontSize(5.5).fillColor('#047857')
         .text('OFFICIAL PASS 2026', sealX - 22, sealY - 20, { width: 44, align: 'center' });

      // Center Bold Text: "Payment Successful"
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#047857')
         .text('Payment', sealX - 22, sealY - 7, { width: 44, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#047857')
         .text('Successful', sealX - 22, sealY + 4, { width: 44, align: 'center' });
      doc.restore();

      // 5. Header Section: College Name, Address & Transaction Pass ID
      doc.save();
      doc.font('Helvetica-Bold')
         .fontSize(15)
         .fillColor('#0f172a')
         .text(collegeName, 90, 24, { width: 240, align: 'center' });

      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#64748b')
         .text(collegeAddress, 90, 44, { width: 240, align: 'center' });

      doc.font('Helvetica-Bold')
         .fontSize(8)
         .fillColor('#94a3b8')
         .text(passId, 90, 58, { width: 240, align: 'center' });
      doc.restore();

      // 6. Program Badge Tag (Soft Emerald Green Pill)
      doc.save();
      doc.roundedRect(25, 90, 130, 18, 9).fill('#ecfdf5');
      doc.font('Helvetica-Bold')
         .fontSize(8.5)
         .fillColor('#059669')
         .text(programTitle, 32, 94, { width: 116, align: 'left' });
      doc.restore();

      // 7. Participant Name
      doc.save();
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .fillColor('#0f172a')
         .text(studentName, 25, 116, { width: 210 });

      // 8. Mobile Number & Blood Group Info
      doc.font('Helvetica-Bold')
         .fontSize(7)
         .fillColor('#94a3b8')
         .text('MOBILE NUMBER', 25, 142);
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#334155')
         .text(phone, 25, 151);

      doc.font('Helvetica-Bold')
         .fontSize(7)
         .fillColor('#94a3b8')
         .text('BLOOD GROUP', 115, 142);
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#047857')
         .text(bloodGroup, 115, 151);
      doc.restore();

      // 9. Student Photo (Top Right Corner Circle Avatar)
      const avatarCenterX = 285;
      const avatarCenterY = 130;
      const avatarRadius = 36;

      doc.save();
      if (photoBuffer) {
        try {
          doc.circle(avatarCenterX, avatarCenterY, avatarRadius).clip();
          doc.image(photoBuffer, avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, {
            width: avatarRadius * 2,
            height: avatarRadius * 2
          });
        } catch (imgErr) {
          console.warn('[PDF Generator] Could not render photo buffer:', imgErr.message);
          doc.circle(avatarCenterX, avatarCenterY, avatarRadius).fillAndStroke('#f1f5f9', '#cbd5e1');
        }
      } else {
        // Soft Light Gray Avatar Placeholder Circle
        doc.circle(avatarCenterX, avatarCenterY, avatarRadius).fillAndStroke('#f1f5f9', '#cbd5e1');
        doc.circle(avatarCenterX, avatarCenterY - 6, 12).fill('#94a3b8');
      }
      doc.restore();

      // Avatar Border Ring
      doc.save();
      doc.circle(avatarCenterX, avatarCenterY, avatarRadius).lineWidth(2).strokeColor('#cbd5e1').stroke();
      doc.restore();

      // 10. Divider Line Accent
      doc.save();
      doc.moveTo(25, 180).lineTo(335, 180).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
      doc.circle(180, 180, 4).fill('#10b981');
      doc.restore();

      // 11. Academic Details Grid (Degree, Specialization, Semester)
      const boxY = 195;
      const boxW = 98;
      const boxH = 44;

      doc.save();
      // Degree Box
      doc.roundedRect(25, boxY, boxW, boxH, 8).fillAndStroke('#f8fafc', '#f1f5f9');
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#94a3b8').text('DEGREE', 28, boxY + 8, { width: boxW - 6, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0f172a').text(degree, 28, boxY + 22, { width: boxW - 6, align: 'center' });

      // Specialization Box
      doc.roundedRect(131, boxY, boxW, boxH, 8).fillAndStroke('#f8fafc', '#f1f5f9');
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#94a3b8').text('SPECIALIZATION', 134, boxY + 8, { width: boxW - 6, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a').text(branch, 134, boxY + 20, { width: boxW - 6, align: 'center' });

      // Semester Box
      doc.roundedRect(237, boxY, boxW, boxH, 8).fillAndStroke('#f8fafc', '#f1f5f9');
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#94a3b8').text('SEMESTER', 240, boxY + 8, { width: boxW - 6, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#0f172a').text(semester, 240, boxY + 22, { width: boxW - 6, align: 'center' });
      doc.restore();

      // 12. Dotted Ticket Tear Line
      const dotY = 255;
      doc.save();
      doc.circle(10, dotY, 7).fill('#f8fafc');
      doc.circle(350, dotY, 7).fill('#f8fafc');

      doc.moveTo(22, dotY)
         .lineTo(338, dotY)
         .lineWidth(1)
         .dash(4, { space: 3 })
         .strokeColor('#cbd5e1')
         .stroke();
      doc.restore();

      // 13. Event Details & Scannable QR Code Section
      const bottomY = 275;

      doc.save();
      // Event Date Block
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#047857').text('EVENT DATE', 25, bottomY);
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a').text(currentDate, 25, bottomY + 12);

      // Workshop Time Block
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748b').text('WORKSHOP TIME', 25, bottomY + 36);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a').text('10:00 AM - 04:00 PM', 25, bottomY + 48);

      // Official Pass Badge Pill
      doc.roundedRect(25, bottomY + 74, 90, 18, 9).fill('#d1fae5');
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#047857').text('• OFFICIAL PASS', 32, bottomY + 79);
      doc.restore();

      // QR Code Image & Frame (Bottom Right)
      const qrX = 220;
      const qrY = bottomY - 5;
      const qrSize = 115;
      const brLen = 12;

      doc.save();
      doc.lineWidth(2).strokeColor('#059669');
      // Top-Left Corner
      doc.moveTo(qrX - 4, qrY - 4 + brLen).lineTo(qrX - 4, qrY - 4).lineTo(qrX - 4 + brLen, qrY - 4).stroke();
      // Top-Right Corner
      doc.moveTo(qrX + qrSize + 4 - brLen, qrY - 4).lineTo(qrX + qrSize + 4, qrY - 4).lineTo(qrX + qrSize + 4, qrY - 4 + brLen).stroke();
      // Bottom-Left Corner
      doc.moveTo(qrX - 4, qrY + qrSize + 4 - brLen).lineTo(qrX - 4, qrY + qrSize + 4).lineTo(qrX - 4 + brLen, qrY + qrSize + 4).stroke();
      // Bottom-Right Corner
      doc.moveTo(qrX + qrSize + 4 - brLen, qrY + qrSize + 4).lineTo(qrX + qrSize + 4, qrY + qrSize + 4).lineTo(qrX + qrSize + 4, qrY + qrSize + 4 - brLen).stroke();

      // Render QR Image
      doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
      doc.restore();

      // Footer Instructions Line
      doc.save();
      doc.font('Helvetica').fontSize(7).fillColor('#94a3b8').text('Please present this PDF Pass at the gate entry desk on workshop day.', 20, 532, { width: 320, align: 'center' });
      doc.restore();

      doc.end();
    } catch (err) {
      console.error('[PDF Generation Error]:', err);
      reject(err);
    }
  });
};

module.exports = { generatePassPDF };
