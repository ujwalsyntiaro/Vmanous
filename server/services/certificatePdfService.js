const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Generates an in-memory Landscape PDF Buffer for the Workshop Certificate
 * @param {Object} data - Student & Workshop Details
 * @returns {Promise<Buffer>}
 */
const generateCertificatePDF = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const studentName = data.studentName || data.name || 'Participant';
      const collegeName = data.collegeName || data.college || 'National Institute of Technology';
      const workshopTitle = data.workshopTitle || data.programTitle || data.title || 'Generative AI & Machine Learning';
      const dateStr = data.workshopDate || data.eventDate || data.startDate || '25th August 2026';
      const certificateId = data.certificateCode || data.certificateId || `VM-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const duration = data.duration || '30';

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

      // 1. Background Image
      const bgPath = path.join(__dirname, '../../frontend/public/VMANOUS_Certificate_Final.png');
      if (fs.existsSync(bgPath)) {
        doc.image(bgPath, 0, 0, { width: width, height: height });
      } else {
        doc.rect(0, 0, width, height).fill('#ffffff'); // fallback
      }

      // Hide the placeholder text from the image using white rectangles
      // Mask SRN and Issue Date (wider and taller to cover all old text on the top right)
      doc.rect(width - 270, 20, 250, 60).fill('#ffffff');
      
      // Mask Candidate Name and original line (completely hidden without hitting the header)
      doc.rect(120, 225, width - 240, 100).fill('#ffffff');
      
      // Mask Paragraph (taller and wider to cover the entire old paragraph)
      doc.rect(80, 315, width - 160, 120).fill('#ffffff');

      // 2. Top Right: SRN & Issue Date
      const today = new Date();
      const issueDate = `${today.getDate().toString().padStart(2, '0')} / ${(today.getMonth() + 1).toString().padStart(2, '0')} / ${today.getFullYear()}`;

      doc.save();
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text(`SRN : ${certificateId}`, width - 220, 35, { align: 'left' });

      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#000000')
        .text(`Issue Date: ${issueDate}`, width - 220, 50, { align: 'left' });
      doc.restore();

      // 3. Student Recipient Name (Center, Cursive/Italic)
      const fontPath = path.join(__dirname, 'GreatVibes-Regular.ttf');
      if (fs.existsSync(fontPath)) {
        doc.registerFont('Brittany', fontPath);
      }

      doc.fontSize(48)
        .font(fs.existsSync(fontPath) ? 'Brittany' : 'Times-Italic')
        .fillColor('#000000')
        .text(studentName, 0, 240, {
          align: 'center',
          characterSpacing: 1
        });

      // Draw dotted line under the name with a little bit of spacing
      doc.save();
      doc.moveTo(width / 2 - 180, 295)
         .lineTo(width / 2 + 180, 295)
         .lineWidth(1)
         .dash(2, {space: 3})
         .strokeOpacity(0.5)
         .stroke('#64748b');
      doc.restore();

      // 4. Description Body Paragraph
      let formattedSummitDate = dateStr;
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        // 'AUG 24, 2026' format to match design
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        formattedSummitDate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      }

      const descText = `For successfully completing the AI Summit on ${formattedSummitDate}, with a total\nduration of ${duration} hours, and demonstrating active participation in\nexploring AI technologies, industry insights, and practical applications.`;

      const baskervillePath = 'C:\\Windows\\Fonts\\BASKVILL.TTF';
      if (fs.existsSync(baskervillePath)) {
        doc.registerFont('Baskerville', baskervillePath);
      }

      doc.fontSize(16)
        .font(fs.existsSync(baskervillePath) ? 'Baskerville' : 'Times-Roman')
        .fillColor('#000000')
        .text(descText, width / 2 - 325, 318, {
          align: 'center',
          width: 650,
          lineGap: 4,
          characterSpacing: 0.5
        });

      // Finalize PDF
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateCertificatePDF };
