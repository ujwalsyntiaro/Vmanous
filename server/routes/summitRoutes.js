const express = require('express');
const router = express.Router();
const {
  getSummits,
  createSummit,
  updateSummit,
  deleteSummit,
  verifyEntryCode,
  sendRescheduleOtp,
  verifyRescheduleOtp,
  getAuthorizedEmailConfig,
  requestEmailChangeOtp,
  verifyEmailChangeOtp
} = require('../controllers/summitController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSummits)
  .post(verifyAdminToken, createSummit);

router.get('/authorized-email', getAuthorizedEmailConfig);
router.post('/request-email-change', verifyAdminToken, requestEmailChangeOtp);
router.post('/verify-email-change', verifyAdminToken, verifyEmailChangeOtp);

router.post('/verify-entry-code', verifyEntryCode);
router.post('/send-reschedule-otp', verifyAdminToken, sendRescheduleOtp);
router.post('/verify-reschedule-otp', verifyAdminToken, verifyRescheduleOtp);

router.route('/:id')
  .put(verifyAdminToken, updateSummit)
  .delete(verifyAdminToken, deleteSummit);

module.exports = router;
