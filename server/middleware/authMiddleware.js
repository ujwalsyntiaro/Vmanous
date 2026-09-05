const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vmanous_secure_jwt_token_auth_secret_key_2026';

const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers['x-admin-token']) {
      token = req.headers['x-admin-token'];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access Denied: No Admin Security Token Provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access Forbidden: Invalid Admin Privileges'
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: Invalid or Expired Token'
    });
  }
};

module.exports = { verifyAdminToken, JWT_SECRET };
