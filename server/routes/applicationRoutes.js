const express = require('express');
const router = express.Router();
const {
  getApplications,
  createApplication,
  getPaymentTransactions,
  updateVerificationStatus,
  deleteApplication,
  deleteAllApplications
} = require('../controllers/applicationController');

router.route('/')
  .get(getApplications)
  .post(createApplication)
  .delete(deleteAllApplications);

router.route('/all')
  .delete(deleteAllApplications);

router.route('/clear')
  .delete(deleteAllApplications);

router.route('/transactions')
  .get(getPaymentTransactions);

router.route('/:id')
  .delete(deleteApplication);

router.route('/:id/status')
  .patch(updateVerificationStatus);

module.exports = router;
