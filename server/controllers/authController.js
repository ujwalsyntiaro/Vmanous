const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const configFilePath = path.join(__dirname, '../data/securityConfig.json');

const getStoredCredentials = () => {
  try {
    if (fs.existsSync(configFilePath)) {
      const raw = fs.readFileSync(configFilePath, 'utf8');
      const data = JSON.parse(raw);
      if (data && data.adminId && data.adminPassword) {
        return {
          id: String(data.adminId).trim(),
          password: String(data.adminPassword).trim()
        };
      }
    }
  } catch (e) {
    console.error('Error reading credentials from securityConfig.json:', e);
  }

  return {
    id: process.env.ADMIN_DEFAULT_EMAIL || 'am@vmanous.com',
    password: process.env.ADMIN_DEFAULT_PASSWORD || 'admin123'
  };
};

const saveCredentials = (newId, newPassword) => {
  try {
    const dir = path.dirname(configFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let currentConfig = {};
    if (fs.existsSync(configFilePath)) {
      try {
        currentConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf8')) || {};
      } catch (e) {}
    }

    currentConfig.adminId = String(newId).trim();
    currentConfig.adminPassword = String(newPassword).trim();
    currentConfig.updatedAt = new Date().toISOString();

    fs.writeFileSync(configFilePath, JSON.stringify(currentConfig, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error saving credentials to securityConfig.json:', e);
    return false;
  }
};

// POST /api/v1/auth/login
const adminLogin = async (req, res) => {
  try {
    const { id, email, password } = req.body;
    const inputId = (id || email || '').trim().toLowerCase();
    const inputPassword = (password || '').trim();

    if (!inputId || !inputPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both Admin ID/Email and Password'
      });
    }

    const currentCreds = getStoredCredentials();
    const storedId = currentCreds.id.toLowerCase();

    const isMatch = (inputId === storedId || inputId === 'am@vmanous.com' || inputId === 'admin') &&
                    inputPassword === currentCreds.password;

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Admin ID or Password'
      });
    }

    // Generate Secure JWT Token (valid for 7 days)
    const token = jwt.sign(
      {
        role: 'admin',
        email: currentCreds.id
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin Login Successful',
      token,
      admin: {
        id: currentCreds.id,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, error: 'Server Error during Login' });
  }
};

// GET /api/v1/auth/verify
const verifyToken = async (req, res) => {
  return res.status(200).json({
    success: true,
    valid: true,
    user: req.user
  });
};

// POST /api/v1/auth/update-credentials (Protected)
const updateAdminCredentials = async (req, res) => {
  try {
    const { currentPassword, newId, newPassword } = req.body;
    const currentCreds = getStoredCredentials();

    if (currentPassword !== currentCreds.password) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    if (!newId || newId.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid Admin ID or Email'
      });
    }

    if (!newPassword || newPassword.trim().length < 4) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 4 characters long'
      });
    }

    saveCredentials(newId, newPassword);

    // Generate refreshed token
    const token = jwt.sign(
      {
        role: 'admin',
        email: newId.trim()
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin credentials updated successfully',
      token,
      admin: {
        id: newId.trim(),
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Update Credentials Error:', error);
    return res.status(500).json({ success: false, error: 'Server Error updating credentials' });
  }
};

module.exports = {
  adminLogin,
  verifyToken,
  updateAdminCredentials
};
