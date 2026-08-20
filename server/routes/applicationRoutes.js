const express = require('express');
const router = express.Router();
const {
  getApplications,
  createApplication,
  getPaymentTransactions,
  updateVerificationStatus,
  deleteApplication
} = require('../controllers/applicationController');

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/transactions')
  .get(getPaymentTransactions);

router.route('/:id')
  .delete(deleteApplication);

router.route('/:id/status')
  .patch(updateVerificationStatus);

module.exports = router;
