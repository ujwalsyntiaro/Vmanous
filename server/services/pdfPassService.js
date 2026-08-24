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
      const passId = data.passCode || data.transactionId || data.passId || 'T2608231343366807015049';
      const studentName = data.studentName || data.name || 'Ramesh Shahu';
      const collegeName = (data.collegeName || 'VALLURUPALLI NAGESWARA RAO VIGNANA JYOTHI INSTITUTE OF ENGINEERING &TECHNOLOGY').toUpperCase();
      const rawAddress = data.venueLocation || data.collegeAddress || data.city || 'Hyderabad';
      const collegeAddress = rawAddress.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
      const programTitle = data.programTitle || data.programInterest || 'AI Summit 2026';
      const degree = data.degree || 'B.E.';
      const branch = data.branch || data.specialization || 'Cloud Computing & DevOps';
      const semester = data.year || data.semester || '5th Semester';
      const bloodGroup = data.bloodGroup || 'A-';
      const phone = data.phone || data.mobileNumber || '8523697412';
      
      let eventDateStr = '23 Aug 2026';
      if (data.eventDate || data.startDate) {
        try {
          const d = new Date(data.eventDate || data.startDate);
          if (!isNaN(d.getTime())) {
            eventDateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          }
        } catch (e) {}
      }

      const timingStr = data.timing || data.workshopTime || '10:00 AM - 04:00 PM';

      // Dynamic Card Height Calculation
      const collegeFontSize = collegeName.length > 35 ? 9.5 : (collegeName.length > 22 ? 11 : 12.5);
      const collegeLines = Math.max(1, Math.ceil((collegeName.length * (collegeFontSize * 0.58)) / 220));
      const headerExtraY = (collegeLines - 1) * 14;

      const studentNameLines = Math.max(1, Math.ceil((studentName.length * 9.5) / 200));
      const studentExtraY = (studentNameLines - 1) * 16;

      const totalCardHeight = Math.max(560, 560 + headerExtraY + studentExtraY);

      const doc = new PDFDocument({
        size: [360, totalCardHeight],
        margin: 15
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Coordinates setup
      let curY = 20;

      // 1. Fetch QR Code Buffer
      const qrDataText = `=== VMANOUS WORKSHOP PASS ===\nPass ID: ${passId}\nParticipant: ${studentName}\nEmail: ${data.email || 'N/A'}\nMobile: ${phone}\nCollege: ${collegeName}\nStatus: VERIFIED & PAID`;
      const qrDataUrl = await QRCode.toDataURL(qrDataText, { width: 120, margin: 1 });
      const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

      // 2. Fetch Student Photo Buffer
      const photoBuffer = await getPhotoBuffer(data.selfiePhotoUrl);

      // 3. Main Card Background & Left/Right Side Borders Only (No Straight Top/Bottom Lines)
      doc.save();
      // White Background Fill
      doc.rect(10, 10, 340, totalCardHeight - 20).fill('#ffffff');
      // Left & Right Vertical Side Border Lines Only
      doc.lineWidth(1).strokeColor('#000000');
      doc.moveTo(10, 10).lineTo(10, totalCardHeight - 10).stroke();
      doc.moveTo(350, 10).lineTo(350, totalCardHeight - 10).stroke();
      doc.restore();

      // 4. Top Sawtooth (Zig-Zag) Cutouts
      doc.save();
      doc.lineWidth(1).strokeColor('#000000');
      const toothW = 8;
      const toothH = 3.5;
      let toothX = 10;
      doc.moveTo(10, 10);
      for (let i = 0; i < 42.5; i++) {
        doc.lineTo(toothX + toothW / 2, 10 + toothH).lineTo(toothX + toothW, 10);
        toothX += toothW;
      }
      doc.stroke();
      doc.restore();

      // 5. Top Center Checkmark Symbol (Overlapping Zig-Zag cleanly like Web Pass Image 2)
      doc.save();
      // Mask Circle
      doc.circle(180, 15, 20).fill('#ffffff');
      // Green Arc Circle
      doc.lineWidth(3.5).strokeColor('#5cb85c')
         .path('M 195 9 A 17 17 0 1 0 195 24')
         .stroke();
      // Checkmark tick
      doc.lineWidth(3.5).strokeColor('#5cb85c')
         .moveTo(170, 16)
         .lineTo(177, 24)
         .lineTo(197, 4)
         .stroke();
      doc.restore();

      // 6. Header Text Section
      curY = 44;
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .fillColor('#5cb85c')
         .text('Payment Successful!', 20, curY, { width: 320, align: 'center' });

      curY = doc.y + 6;

      doc.font('Helvetica-Bold')
         .fontSize(collegeFontSize)
         .fillColor('#0f172a')
         .text(collegeName, 20, curY, { width: 320, align: 'center', lineGap: 1 });

      curY = doc.y + 3;
      if (collegeAddress) {
        doc.font('Helvetica-Bold')
           .fontSize(8.5)
           .fillColor('#64748b')
           .text(collegeAddress, 20, curY, { width: 320, align: 'center' });
        curY = doc.y + 2;
      }

      doc.font('Helvetica-Bold')
         .fontSize(8)
         .fillColor('#94a3b8')
         .text(passId, 20, curY, { width: 320, align: 'center' });

      const headerBottomY = doc.y;

      // 7. Program Badge Tag
      const badgeY = Math.max(132, headerBottomY + 10);
      doc.save();
      doc.roundedRect(25, badgeY, 115, 18, 9).fill('#ecfdf5');
      doc.font('Helvetica-Bold')
         .fontSize(8.5)
         .fillColor('#059669')
         .text(programTitle, 32, badgeY + 4, { width: 104, align: 'left' });
      doc.restore();

      // 8. Participant Name
      const nameY = badgeY + 24;
      doc.save();
      doc.font('Helvetica-Bold')
         .fontSize(15)
         .fillColor('#0f172a')
         .text(studentName, 25, nameY, { width: 210 });
      doc.restore();

      doc.font('Helvetica-Bold').fontSize(15);
      const nameHeight = doc.heightOfString(studentName, { width: 210 });

      // 9. Mobile Number & Blood Group Info (Title Case Labels)
      const infoY = nameY + nameHeight + 8;
      doc.save();
      doc.font('Helvetica-Bold')
         .fontSize(7.5)
         .fillColor('#94a3b8')
         .text('Mobile Number', 25, infoY);
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#334155')
         .text(phone, 25, infoY + 10);

      doc.font('Helvetica-Bold')
         .fontSize(7.5)
         .fillColor('#94a3b8')
         .text('Blood Group', 115, infoY);
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#047857')
         .text(bloodGroup, 115, infoY + 10);
      doc.restore();

      // 10. Student Photo (Right Corner Avatar)
      const avatarCenterX = 285;
      const avatarCenterY = nameY + 20;
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
          console.warn('[PDF Generator] Photo buffer render error:', imgErr.message);
          doc.circle(avatarCenterX, avatarCenterY, avatarRadius).fillAndStroke('#f1f5f9', '#cbd5e1');
        }
      } else {
        doc.circle(avatarCenterX, avatarCenterY, avatarRadius).fillAndStroke('#f1f5f9', '#cbd5e1');
        doc.circle(avatarCenterX, avatarCenterY - 6, 12).fill('#94a3b8');
      }
      doc.restore();

      doc.save();
      doc.circle(avatarCenterX, avatarCenterY, avatarRadius).lineWidth(2).strokeColor('#cbd5e1').stroke();
      doc.restore();

      // 11. Center Accent Divider Line
      const dividerY = Math.max(infoY + 28, avatarCenterY + 44);
      doc.save();
      doc.moveTo(25, dividerY).lineTo(335, dividerY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
      doc.circle(180, dividerY, 4).fill('#10b981');
      doc.restore();

      // 12. Academic Details Grid (Degree, Specialization, Semester in Title Case)
      const boxY = dividerY + 15;
      const boxW = 98;
      const boxH = 44;

      doc.save();
      // Degree Box
      doc.roundedRect(25, boxY, boxW, boxH, 8).lineWidth(1).strokeColor('#e2e8f0').fillAndStroke('#ffffff', '#e2e8f0');
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#94a3b8').text('Degree', 28, boxY + 8, { width: boxW - 6, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a').text(degree, 28, boxY + 22, { width: boxW - 6, align: 'center' });

      // Specialization Box
      doc.roundedRect(131, boxY, boxW, boxH, 8).lineWidth(1).strokeColor('#e2e8f0').fillAndStroke('#ffffff', '#e2e8f0');
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#94a3b8').text('Specialization', 134, boxY + 8, { width: boxW - 6, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f172a').text(branch, 134, boxY + 20, { width: boxW - 6, align: 'center' });

      // Semester Box
      doc.roundedRect(237, boxY, boxW, boxH, 8).lineWidth(1).strokeColor('#e2e8f0').fillAndStroke('#ffffff', '#e2e8f0');
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#94a3b8').text('Semester', 240, boxY + 8, { width: boxW - 6, align: 'center' });
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#0f172a').text(semester, 240, boxY + 22, { width: boxW - 6, align: 'center' });
      doc.restore();

      // 13. Dotted Ticket Tear Line & 180° Side Notch Cuts
      const dotY = boxY + boxH + 16;
      doc.save();
      // Left side notch mask
      doc.rect(8, dotY - 14, 4, 28).fill('#ffffff');
      doc.path(`M 10,${dotY - 14} A 12,14 0 0,1 10,${dotY + 14}`)
         .lineWidth(1)
         .strokeColor('#000000')
         .stroke();

      // Right side notch mask
      doc.rect(348, dotY - 14, 4, 28).fill('#ffffff');
      doc.path(`M 350,${dotY - 14} A 12,14 0 0,0 350,${dotY + 14}`)
         .lineWidth(1)
         .strokeColor('#000000')
         .stroke();

      // Dashed Line
      doc.moveTo(22, dotY)
         .lineTo(338, dotY)
         .lineWidth(1.5)
         .dash(4, { space: 3 })
         .strokeColor('#000000')
         .stroke();
      doc.restore();

      // 14. Event Details & Icons
      const bottomY = dotY + 20;

      doc.save();
      // Calendar icon + EVENT DATE
      doc.lineWidth(1).strokeColor('#047857');
      doc.rect(25, bottomY - 1, 8, 8).stroke();
      doc.moveTo(25, bottomY + 2).lineTo(33, bottomY + 2).stroke();
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#047857').text('EVENT DATE', 37, bottomY);
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#0f172a').text(eventDateStr, 25, bottomY + 12);

      // Clock icon + WORKSHOP TIME
      doc.circle(29, bottomY + 39, 4).stroke();
      doc.moveTo(29, bottomY + 37).lineTo(29, bottomY + 39).lineTo(31, bottomY + 39).stroke();
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748b').text('WORKSHOP TIME', 37, bottomY + 36);
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a').text(timingStr, 25, bottomY + 48);

      // OFFICIAL PASS Badge Tag
      doc.roundedRect(25, bottomY + 74, 90, 18, 9).fill('#d1fae5');
      doc.circle(33, bottomY + 83, 2.5).fill('#047857');
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#047857').text('OFFICIAL PASS', 39, bottomY + 79);
      doc.restore();

      // 15. QR Code Image & Corner Brackets
      const qrX = 220;
      const qrY = bottomY - 5;
      const qrSize = 115;
      const brLen = 12;

      doc.save();
      doc.lineWidth(1).strokeColor('#000000');
      doc.moveTo(qrX - 4, qrY - 4 + brLen).lineTo(qrX - 4, qrY - 4).lineTo(qrX - 4 + brLen, qrY - 4).stroke();
      doc.moveTo(qrX + qrSize + 4 - brLen, qrY - 4).lineTo(qrX + qrSize + 4, qrY - 4).lineTo(qrX + qrSize + 4, qrY - 4 + brLen).stroke();
      doc.moveTo(qrX - 4, qrY + qrSize + 4 - brLen).lineTo(qrX - 4, qrY + qrSize + 4).lineTo(qrX - 4 + brLen, qrY + qrSize + 4).stroke();
      doc.moveTo(qrX + qrSize + 4 - brLen, qrY + qrSize + 4).lineTo(qrX + qrSize + 4, qrY + qrSize + 4).lineTo(qrX + qrSize + 4, qrY + qrSize + 4 - brLen).stroke();

      doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
      doc.restore();

      // 16. Bottom Sawtooth (Zig-Zag) Cutouts
      doc.save();
      doc.lineWidth(1).strokeColor('#000000');
      const bY = totalCardHeight - 10;
      let bX = 10;
      doc.moveTo(10, bY);
      for (let i = 0; i < 42.5; i++) {
        doc.lineTo(bX + toothW / 2, bY - toothH).lineTo(bX + toothW, bY);
        bX += toothW;
      }
      doc.stroke();
      doc.restore();

      // 17. Footer Text Line
      doc.save();
      const footerY = totalCardHeight - 28;
      doc.font('Helvetica').fontSize(7).fillColor('#94a3b8').text('Please present this PDF Pass at the gate entry desk on workshop day.', 20, footerY, { width: 320, align: 'center' });
      doc.restore();

      doc.end();
    } catch (err) {
      console.error('[PDF Generation Error]:', err);
      reject(err);
    }
  });
};

module.exports = { generatePassPDF };
