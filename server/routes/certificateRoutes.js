const express = require('express');
const router = express.Router();
const {
  getWorkshops,
  getWorkshopStudents,
  sendBulkCertificates,
  previewCertificatePdf
} = require('../controllers/certificateController');

// Workshop list with counter & capacity stats
router.get('/workshops', getWorkshops);

// Enrolled students for a selected college workshop
router.get('/students/:summitId', getWorkshopStudents);

// Bulk send certificates to selected student IDs
router.post('/send-bulk', sendBulkCertificates);

// Preview or download PDF Certificate
router.get('/preview-pdf/:applicationId', previewCertificatePdf);

module.exports = router;
