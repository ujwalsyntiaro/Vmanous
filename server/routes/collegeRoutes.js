const express = require('express');
const router = express.Router();
const {
  getColleges,
  createCollege,
  updateCollege,
  deleteCollege
} = require('../controllers/collegeController');

router.route('/')
  .get(getColleges)
  .post(createCollege);

router.route('/:id')
  .put(updateCollege)
  .delete(deleteCollege);

module.exports = router;
