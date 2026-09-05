const express = require('express');
const router = express.Router();
const { adminLogin, verifyToken, updateAdminCredentials } = require('../controllers/authController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/verify', verifyAdminToken, verifyToken);
router.post('/update-credentials', verifyAdminToken, updateAdminCredentials);

module.exports = router;
