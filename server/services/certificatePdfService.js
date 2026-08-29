const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

/**
 * Generates an in-memory Landscape PDF Buffer for the Workshop Certificate
 * @param {Object} data - Student & Workshop Details
 * @returns {Promise<Buffer>}
 */
const generateCertificatePDF = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const studentName = (data.studentName || data.name || 'Participant').toUpperCase();
      const collegeName = data.collegeName || data.college || 'National Institute of Technology';
      const workshopTitle = data.workshopTitle || data.programTitle || data.title || 'Generative AI & Machine Learning';
      const dateStr = data.workshopDate || data.eventDate || data.startDate || '25th August 2026';
      const certificateId = data.certificateCode || data.certificateId || `VM-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // A4 Landscape: width = 841.89 pt, height = 595.28 pt
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
        info: {
          Title: `Certificate of Completion - ${studentName}`,
          Author: 'VMANOUS Academy',
          Subject: 'Workshop Certificate of Completion'
        }
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const width = 841.89;
      const height = 595.28;

      // 1. Background Cream / White
      doc.rect(0, 0, width, height).fill('#FCFCFD');

      // 2. Outer Deep Navy Border
      doc.lineWidth(6)
         .strokeColor('#0B1B3D')
         .rect(20, 20, width - 40, height - 40)
         .stroke();

      // 3. Inner Gold Border
      doc.lineWidth(1.5)
         .strokeColor('#C59B27')
         .rect(28, 28, width - 56, height - 56)
         .stroke();

      // 4. Subtle Guilloche Corner Accents
      const drawCornerAccent = (x, y, flipX, flipY) => {
        doc.save();
        doc.translate(x, y);
        doc.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        doc.lineWidth(1).strokeColor('#E2CA7B');
        doc.path('M 0 0 L 30 0 L 30 5 L 5 5 L 5 30 L 0 30 Z').fillAndStroke('#F6EAD0', '#C59B27');
        doc.restore();
      };

      drawCornerAccent(32, 32, false, false);
      drawCornerAccent(width - 32, 32, true, false);
      drawCornerAccent(32, height - 32, false, true);
      drawCornerAccent(width - 32, height - 32, true, true);

      // 5. Header: Tech Logo Monogram & Organization Name
      doc.save();
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#0B1B3D')
         .text('⚡ VMANOUS ACADEMY OF ARTIFICIAL INTELLIGENCE & RESEARCH', 0, 56, {
           align: 'center',
           characterSpacing: 2
         });
      doc.restore();

      // Decorative mini line under header
      doc.lineWidth(1.5)
         .strokeColor('#C59B27')
         .moveTo(width / 2 - 120, 74)
         .lineTo(width / 2 + 120, 74)
         .stroke();

      // 6. Main Certificate Title
      doc.fontSize(28)
         .font('Helvetica-Bold')
         .fillColor('#0B1B3D')
         .text('CERTIFICATE OF COMPLETION', 0, 96, {
           align: 'center',
           characterSpacing: 2.5
         });

      // Subtitle
      doc.fontSize(12)
         .font('Helvetica')
         .fillColor('#64748B')
         .text('This is proudly presented to', 0, 142, {
           align: 'center',
           characterSpacing: 1
         });

      // 7. Student Recipient Name (Highlighted & Large)
      doc.fontSize(26)
         .font('Helvetica-Bold')
         .fillColor('#0F172A')
         .text(studentName, 0, 172, {
           align: 'center',
           characterSpacing: 1.5
         });

      // Gold underline for student name
      const nameWidth = Math.min(doc.widthOfString(studentName) + 60, 480);
      doc.lineWidth(1.5)
         .strokeColor('#C59B27')
         .moveTo(width / 2 - nameWidth / 2, 206)
         .lineTo(width / 2 + nameWidth / 2, 206)
         .stroke();

      // 8. Description Body Paragraph
      const descText = `For successfully participating in and completing the intensive National Level Hands-on Workshop on "${workshopTitle}" conducted at ${collegeName} on ${dateStr}.`;

      doc.fontSize(12.5)
         .font('Helvetica')
         .fillColor('#334155')
         .text(descText, width / 2 - 270, 230, {
           align: 'center',
           width: 540,
           lineGap: 7
         });

      // 9. Generate QR Code for Digital Verification
      const qrData = `=== VMANOUS VERIFIED CERTIFICATE ===\nCertificate ID: ${certificateId}\nStudent: ${studentName}\nCollege: ${collegeName}\nTopic: ${workshopTitle}\nDate: ${dateStr}\nStatus: Officially Issued & Verified\n====================================`;
      const qrDataUrl = await QRCode.toDataURL(qrData, { width: 150, margin: 1 });
      const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

      // 10. Bottom Elements (Seal, Signatures, QR Code)
      const bottomY = 380;

      // Left: Golden Seal Badge
      doc.save();
      const sealX = 140;
      const sealY = bottomY + 45;
      
      // Outer golden star/circle
      doc.circle(sealX, sealY, 40).lineWidth(2).strokeColor('#C59B27').fillColor('#FDF3D8').fillAndStroke();
      doc.circle(sealX, sealY, 34).lineWidth(1).strokeColor('#C59B27').fillColor('#FFFFFF').fillAndStroke();
      
      doc.fontSize(8)
         .font('Helvetica-Bold')
         .fillColor('#0B1B3D')
         .text('OFFICIAL', sealX - 30, sealY - 14, { width: 60, align: 'center' });
      doc.fontSize(7)
         .font('Helvetica-Bold')
         .fillColor('#C59B27')
         .text('★ ★ ★', sealX - 30, sealY - 2, { width: 60, align: 'center' });
      doc.fontSize(7.5)
         .font('Helvetica-Bold')
         .fillColor('#0B1B3D')
         .text('EXCELLENCE', sealX - 30, sealY + 8, { width: 60, align: 'center' });

      // Ribbons hanging from seal
      doc.path(`M ${sealX - 16} ${sealY + 36} L ${sealX - 26} ${sealY + 70} L ${sealX - 12} ${sealY + 62} L ${sealX - 2} ${sealY + 70} L ${sealX - 4} ${sealY + 38} Z`).fillColor('#C59B27').fill();
      doc.path(`M ${sealX + 4} ${sealY + 38} L ${sealX + 2} ${sealY + 70} L ${sealX + 12} ${sealY + 62} L ${sealX + 26} ${sealY + 70} L ${sealX + 16} ${sealY + 36} Z`).fillColor('#A37D19').fill();
      doc.restore();

      // Center: Authorized Signatures & Stamp
      doc.save();
      const signX = width / 2;
      const signY = bottomY + 50;

      // Simulated elegant signature stroke
      doc.lineWidth(1.8)
         .strokeColor('#0B1B3D')
         .moveTo(signX - 60, signY + 5)
         .bezierCurveTo(signX - 40, signY - 20, signX - 20, signY + 15, signX + 10, signY - 10)
         .bezierCurveTo(signX + 25, signY - 25, signX + 40, signY + 10, signX + 60, signY + 2)
         .stroke();

      // Signature line
      doc.lineWidth(1)
         .strokeColor('#94A3B8')
         .moveTo(signX - 90, signY + 22)
         .lineTo(signX + 90, signY + 22)
         .stroke();

      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('#0F172A')
         .text('Authorized Director', signX - 90, signY + 28, { width: 180, align: 'center' });

      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#64748B')
         .text('VMANOUS AI & Research Program', signX - 90, signY + 42, { width: 180, align: 'center' });
      doc.restore();

      // Right: QR Code & Verification ID
      doc.save();
      const qrX = width - 180;
      const qrY = bottomY + 8;

      doc.image(qrBuffer, qrX + 15, qrY, { width: 72, height: 72 });

      doc.fontSize(8.5)
         .font('Helvetica-Bold')
         .fillColor('#0B1B3D')
         .text('Certificate ID:', qrX - 20, qrY + 78, { width: 140, align: 'center' });

      doc.fontSize(8.5)
         .font('Helvetica')
         .fillColor('#2563EB')
         .text(certificateId, qrX - 20, qrY + 90, { width: 140, align: 'center' });
      doc.restore();

      // Finalize PDF
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateCertificatePDF };
