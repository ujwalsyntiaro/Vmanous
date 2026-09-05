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
const { verifyAdminToken } = require('../middleware/authMiddleware');

router.route('/')
  .get(getApplications)
  .post(createApplication)
  .delete(verifyAdminToken, deleteAllApplications);

router.route('/all')
  .delete(verifyAdminToken, deleteAllApplications);

router.route('/clear')
  .delete(verifyAdminToken, deleteAllApplications);

router.route('/transactions')
  .get(getPaymentTransactions);

router.route('/:id')
  .delete(verifyAdminToken, deleteApplication);

router.route('/:id/status')
  .patch(verifyAdminToken, updateVerificationStatus);

module.exports = router;
