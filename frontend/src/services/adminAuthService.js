// Default initial credentials fallback
const DEFAULT_CREDS = {
  id: 'am@vmanous.com',
  password: 'admin123'
};

// Retrieve secure JWT Token
export const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vmanous_admin_token') || sessionStorage.getItem('vmanous_admin_token') || null;
};

// Generate standard Auth headers for admin API requests
export const getAuthHeaders = () => {
  const token = getAdminToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Get active credentials from localStorage or fallback to default
export const getAdminCredentials = () => {
  if (typeof window === 'undefined') return DEFAULT_CREDS;
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

// Verify login ID and password via Secure Backend API with JWT Token
export const verifyAdminLogin = async (id, password) => {
  const inputId = (id || '').trim();
  const inputPassword = (password || '').trim();

  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: inputId, password: inputPassword })
    });

    const data = await res.json();
    if (res.ok && data.success && data.token) {
      localStorage.setItem('vmanous_admin_token', data.token);
      sessionStorage.setItem('vmanous_admin_session', 'true');
      localStorage.setItem('vmanous_admin_creds', JSON.stringify({
        id: data.admin?.id || inputId,
        password: inputPassword
      }));
      return { success: true };
    }

    return { success: false, error: data.error || 'Invalid Admin ID or Password' };
  } catch (err) {
    console.warn('Backend login request error, checking local fallback:', err);
    // Offline local fallback
    const creds = getAdminCredentials();
    const currentId = (creds.id || '').trim().toLowerCase();
    const cleanId = inputId.toLowerCase();

    if ((cleanId === currentId || cleanId === 'am@vmanous.com' || cleanId === 'admin') && inputPassword === creds.password) {
      sessionStorage.setItem('vmanous_admin_session', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid Admin ID or Password' };
  }
};

// Check if currently logged in
export const isAdminLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('vmanous_admin_session') === 'true' || Boolean(getAdminToken());
};

// Logout Admin
export const logoutAdmin = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('vmanous_admin_session');
  localStorage.removeItem('vmanous_admin_token');
  sessionStorage.removeItem('vmanous_admin_token');
};

// Update Admin ID & Password securely
export const updateAdminCredentials = async (currentPassword, newId, newPassword) => {
  try {
    const res = await fetch('/api/v1/auth/update-credentials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newId, newPassword })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        localStorage.setItem('vmanous_admin_token', data.token);
      }
      localStorage.setItem('vmanous_admin_creds', JSON.stringify({
        id: newId.trim(),
        password: newPassword.trim()
      }));
      return { success: true, message: 'Admin Credentials updated successfully!' };
    }

    return { success: false, error: data.error || 'Failed to update credentials' };
  } catch (err) {
    console.error('Error updating credentials via API:', err);
    return { success: false, error: 'Network error updating credentials' };
  }
};
