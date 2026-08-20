// Default initial credentials
const DEFAULT_CREDS = {
  id: 'am@vmanous.com',
  password: 'admin123'
};

// Get active credentials from localStorage or fallback to default
export const getAdminCredentials = () => {
  const stored = localStorage.getItem('vmanous_admin_creds');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id && parsed.password) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing admin creds:', e);
    }
  }
  return DEFAULT_CREDS;
};

// Verify login ID and password
export const verifyAdminLogin = (id, password) => {
  const creds = getAdminCredentials();
  const inputId = (id || '').trim().toLowerCase();
  const currentId = (creds.id || '').trim().toLowerCase();

  if ((inputId === currentId || inputId === 'am@vmanous.com' || inputId === 'admin') && password === creds.password) {
    sessionStorage.setItem('vmanous_admin_session', 'true');
    return { success: true };
  }
  return { success: false, error: 'Invalid Admin ID or Password' };
};

// Check if currently logged in
export const isAdminLoggedIn = () => {
  return sessionStorage.getItem('vmanous_admin_session') === 'true';
};

// Logout Admin
export const logoutAdmin = () => {
  sessionStorage.removeItem('vmanous_admin_session');
};

// Update Admin ID & Password
export const updateAdminCredentials = (currentPassword, newId, newPassword) => {
  const creds = getAdminCredentials();
  
  if (currentPassword !== creds.password) {
    return { success: false, error: 'Current password is incorrect' };
  }

  if (!newId || newId.trim().length < 3) {
    return { success: false, error: 'Please enter a valid Admin ID or Email' };
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return { success: false, error: 'New password must be at least 4 characters long' };
  }

  const updatedCreds = {
    id: newId.trim(),
    password: newPassword.trim()
  };

  localStorage.setItem('vmanous_admin_creds', JSON.stringify(updatedCreds));
  return { success: true, message: 'Admin Credentials updated successfully!' };
};
