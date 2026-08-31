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
      const studentName = (data.studentName || data.name || 'Participant').toUpperCase();
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
      const bgPath = path.join(__dirname, '../../VMANOUS Certificate Final .png');
      if (fs.existsSync(bgPath)) {
        doc.image(bgPath, 0, 0, { width: width, height: height });
      } else {
        doc.rect(0, 0, width, height).fill('#ffffff'); // fallback
      }

      // Hide the placeholder text from the image using white rectangles
      // Mask SRN and Issue Date (wider to cover old text on the left)
      doc.rect(width - 250, 20, 210, 45).fill('#ffffff');
      // Mask Candidate Name and original line (completely hidden)
      doc.rect(150, 210, width - 300, 90).fill('#ffffff');
      // Mask Paragraph
      doc.rect(100, 320, width - 200, 90).fill('#ffffff');

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
      doc.fontSize(36)
        .font('Times-Italic')
        .fillColor('#000000')
        .text(studentName, 0, 235, {
          align: 'center',
          characterSpacing: 1
        });

      // 4. Description Body Paragraph
      let formattedSummitDate = dateStr;
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        // 'AUG 24, 2026' format to match design
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        formattedSummitDate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      }

      const descText = `FOR SUCCESSFULLY COMPLETING THE AI SUMMIT ON ${formattedSummitDate}, WITH A TOTAL DURATION OF ${duration} HOURS, AND DEMONSTRATING ACTIVE PARTICIPATION IN EXPLORING AI TECHNOLOGIES, INDUSTRY INSIGHTS, AND PRACTICAL APPLICATIONS.`;

      doc.fontSize(12)
        .font('Times-Roman')
        .fillColor('#2c3e50')
        .text(descText, width / 2 - 250, 335, {
          align: 'center',
          width: 500,
          lineGap: 7,
          characterSpacing: 1
        });

      // Finalize PDF
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateCertificatePDF };
