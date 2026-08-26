const express = require('express');
const router = express.Router();
const {
  getSummits,
  createSummit,
  updateSummit,
  deleteSummit,
  verifyEntryCode
} = require('../controllers/summitController');

router.route('/')
  .get(getSummits)
  .post(createSummit);

router.post('/verify-entry-code', verifyEntryCode);

router.route('/:id')
  .put(updateSummit)
  .delete(deleteSummit);

module.exports = router;
