const express = require('express');
const router = express.Router();
const {
  getSummits,
  createSummit,
  updateSummit,
  deleteSummit
} = require('../controllers/summitController');

router.route('/')
  .get(getSummits)
  .post(createSummit);

router.route('/:id')
  .put(updateSummit)
  .delete(deleteSummit);

module.exports = router;
