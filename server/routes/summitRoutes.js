const express = require('express');
const router = express.Router();
const {
  getSummits,
  createSummit,
  updateSummit,
  deleteSummit,
  verifyEntryCode,
  sendRescheduleOtp,
  verifyRescheduleOtp
} = require('../controllers/summitController');

router.route('/')
  .get(getSummits)
  .post(createSummit);

router.post('/verify-entry-code', verifyEntryCode);
router.post('/send-reschedule-otp', sendRescheduleOtp);
router.post('/verify-reschedule-otp', verifyRescheduleOtp);

router.route('/:id')
  .put(updateSummit)
  .delete(deleteSummit);

module.exports = router;
