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

router.route('/')
  .get(getSummits)
  .post(createSummit);

router.get('/authorized-email', getAuthorizedEmailConfig);
router.post('/request-email-change', requestEmailChangeOtp);
router.post('/verify-email-change', verifyEmailChangeOtp);

router.post('/verify-entry-code', verifyEntryCode);
router.post('/send-reschedule-otp', sendRescheduleOtp);
router.post('/verify-reschedule-otp', verifyRescheduleOtp);

router.route('/:id')
  .put(updateSummit)
  .delete(deleteSummit);

module.exports = router;
