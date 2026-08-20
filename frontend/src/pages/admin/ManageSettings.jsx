import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  Sliders, 
  Save, 
  CheckCircle2, 
  Key, 
  RefreshCw,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  DollarSign,
  Eye,
  EyeOff,
  HelpCircle
} from 'lucide-react';
import { getAdminCredentials, updateAdminCredentials } from '../../services/adminAuthService';

const ManageSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('vmanous_admin_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      siteName: 'VMANOUS AI & Technology Academy',
      contactEmail: 'support@vmanous.com',
      supportPhone: '+91 98765 43210',
      currency: 'INR',
      timezone: 'Asia/Kolkata (GMT+5:30)',
      maintenanceMode: false,
      
      // Notifications
      emailNewApplication: true,
      emailPaymentAlerts: true,
      emailDailyDigest: false,
      smsAlerts: true,
      whatsappAlerts: true,
      
      // Security
      twoFactorAuth: true,
      sessionTimeout: '30m',
      
      // Payment & Tax
      paymentGatewayMode: 'live',
      gstRate: 18,
      autoInvoice: true,
      razorpayKeyId: 'rzp_live_vmanous9982',
      
      // System & UI
      dashboardRefreshRate: '30s',
      debugLogs: false,
    };
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = (e) => {
    e?.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('vmanous_admin_settings', JSON.stringify(settings));
      setIsSaving(false);
      setHasUnsavedChanges(false);
      showToast('All changes saved successfully');
    }, 400);
  };

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showToast('Please fill out all required password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      const res = updateAdminCredentials(
        passwordData.currentPassword,
        passwordData.newId,
        passwordData.newPassword
      );
      setIsSaving(false);

      if (res.success) {
        setPasswordData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        showToast(res.message || 'Admin credentials updated successfully!');
      } else {
        showToast(res.error || 'Failed to update credentials');
      }
    }, 400);
  };

  const tabs = [
    { id: 'general', label: 'General Portal', icon: Globe, badge: null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '5' },
    { id: 'security', label: 'Security & Auth', icon: ShieldCheck, badge: 'Protected' },
    { id: 'payment', label: 'Payment & Billing', icon: CreditCard, badge: 'Live' },
    { id: 'system', label: 'System & Preferences', icon: Sliders, badge: null },
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-white text-green-900 rounded-md shadow-xl transition-all duration-300 border-2 border-green-600 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-green-600 shrink-0" />
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-md border border-green-300 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900">Settings</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white border border-green-500 flex items-center justify-center text-green-700 font-bold shadow-xs">
              <SettingsIcon size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Platform Control Center</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Configure global branding, security protocols, payment gateways, and system rules.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {hasUnsavedChanges && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white text-amber-700 border border-amber-400 rounded-md text-xs font-medium">
              <AlertTriangle size={13} />
              Unsaved Changes
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-white text-green-700 hover:bg-green-50 border-2 border-green-600 active:scale-[0.98] rounded-md text-xs font-bold tracking-wide transition-all shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw size={15} className="animate-spin text-green-600" />
            ) : (
              <Save size={15} className="text-green-600" />
            )}
            Save Configuration
          </button>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
        
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white p-2.5 rounded-md border border-green-300 shadow-sm space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Categories
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-green-50/60 text-green-900 border-2 border-green-600 font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-green-700' : 'text-gray-500'} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                      isActive
                        ? 'bg-white text-green-800 border-green-500'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-gray-100 mt-2 px-3 pb-1">
            <div className="p-3 bg-white rounded-md border border-green-300">
              <div className="flex items-center gap-2 text-xs font-bold text-green-900">
                <HelpCircle size={14} className="text-green-600" />
                Need Assistance?
              </div>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                Refer to documentation for API keys and webhooks.
              </p>
            </div>
          </div>
        </div>

        {/* Right Tab Content Panel */}
        <div className="lg:col-span-3 space-y-5">

          {/* TAB 1: GENERAL PORTAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Card 1: Branding & Info */}
              <div className="bg-white p-6 rounded-md border border-green-300 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Portal Identity & Contact</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Primary information displayed on public footers and email headers.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Platform Name</label>
                    <div className="relative">
                      <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleInputChange('siteName', e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Support Email Address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Helpline Phone Number</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={settings.supportPhone}
                        onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Default Platform Currency</label>
                    <div className="relative">
                      <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={settings.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                      >
                        <option value="INR">INR (₹ - Indian Rupee)</option>
                        <option value="USD">USD ($ - US Dollar)</option>
                        <option value="EUR">EUR (€ - Euro)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: System Status & Maintenance */}
              <div className="bg-white p-6 rounded-md border border-green-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">Maintenance Mode</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                        settings.maintenanceMode 
                          ? 'bg-amber-50 text-amber-800 border-amber-400' 
                          : 'bg-white text-green-700 border-green-500'
                      }`}>
                        {settings.maintenanceMode ? 'Active Maintenance' : 'Operational'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      When active, non-admin visitors see a custom system maintenance screen.
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.maintenanceMode ? 'bg-green-600 border-green-600' : 'bg-gray-200 border-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-md border border-green-300 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Notification Triggers</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage automated alerts sent to administrators.</p>
              </div>

              <div className="divide-y divide-gray-100 space-y-3 pt-2">
                {[
                  {
                    key: 'emailNewApplication',
                    title: 'New Student Application Alerts',
                    desc: 'Send email notification when a student submits a course or summit application.',
                    badge: 'Email'
                  },
                  {
                    key: 'emailPaymentAlerts',
                    title: 'Payment & Revenue Alerts',
                    desc: 'Real-time notification for successful fee payments and Razorpay transactions.',
                    badge: 'Email'
                  },
                  {
                    key: 'emailDailyDigest',
                    title: 'Daily Analytical Summary',
                    desc: 'Morning digest summarizing registrations, revenue, and active sessions.',
                    badge: 'Digest'
                  },
                  {
                    key: 'smsAlerts',
                    title: 'SMS High-Priority Alerts',
                    desc: 'Instant SMS dispatch for critical security events and password resets.',
                    badge: 'SMS'
                  },
                  {
                    key: 'whatsappAlerts',
                    title: 'WhatsApp Business Alerts',
                    desc: 'Send payment confirmation receipt directly to student WhatsApp numbers.',
                    badge: 'WhatsApp'
                  }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between pt-3 first:pt-0">
                    <div className="pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{item.title}</span>
                        <span className="px-2 py-0.2 text-[10px] font-semibold bg-white text-green-700 rounded border border-green-300">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-normal">{item.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInputChange(item.key, !settings[item.key])}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings[item.key] ? 'bg-green-600 border-green-600' : 'bg-gray-200 border-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & AUTH */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              {/* Change Password Card */}
              <div className="bg-white p-6 rounded-md border border-green-300 shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Key size={18} className="text-green-700" />
                    Admin Password Management
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">Update administrator account credentials securely.</p>
                </div>

                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Admin ID / Email</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={passwordData.newId}
                          onChange={(e) => setPasswordData({ ...passwordData, newId: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Password *</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          required
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full pl-10 pr-10 py-2 bg-white border border-green-300 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        >
                          {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="At least 8 characters"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full pl-10 pr-10 py-2 bg-white border border-green-300 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Re-enter new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white text-green-700 hover:bg-green-50 border-2 border-green-600 rounded-md text-xs font-bold transition-all shadow-xs"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Security Rules */}
              <div className="bg-white p-6 rounded-md border border-green-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-gray-500">Enforce OTP verification for admin dashboard login.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('twoFactorAuth', !settings.twoFactorAuth)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.twoFactorAuth ? 'bg-green-600 border-green-600' : 'bg-gray-200 border-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">Session Inactivity Timeout</h3>
                    <p className="text-xs text-gray-500">Auto logout admin when idle.</p>
                  </div>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                    className="px-3 py-1.5 bg-white border border-green-300 rounded-md text-xs font-semibold focus:outline-none focus:border-green-600"
                  >
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT & BILLING */}
          {activeTab === 'payment' && (
            <div className="bg-white p-6 rounded-md border border-green-300 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Razorpay Payment Integration</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Manage live API keys and GST billing rules.</p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                  settings.paymentGatewayMode === 'live'
                    ? 'bg-white text-green-700 border-green-500'
                    : 'bg-amber-50 text-amber-700 border-amber-300'
                }`}>
                  {settings.paymentGatewayMode === 'live' ? '● Production Live' : '● Test Sandbox'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Environment Mode</label>
                  <select
                    value={settings.paymentGatewayMode}
                    onChange={(e) => handleInputChange('paymentGatewayMode', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                  >
                    <option value="live">Production (Live Payments)</option>
                    <option value="test">Sandbox (Test Mode)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Razorpay Key ID</label>
                  <input
                    type="text"
                    value={settings.razorpayKeyId}
                    onChange={(e) => handleInputChange('razorpayKeyId', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-mono font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Standard GST Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.gstRate}
                    onChange={(e) => handleInputChange('gstRate', Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white rounded-md border border-green-300 self-end h-[40px]">
                  <span className="text-xs font-bold text-gray-900">Auto Invoice PDFs</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange('autoInvoice', !settings.autoInvoice)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.autoInvoice ? 'bg-green-600 border-green-600' : 'bg-gray-200 border-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.autoInvoice ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM PREFERENCES */}
          {activeTab === 'system' && (
            <div className="bg-white p-6 rounded-md border border-green-300 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">System Performance & Controls</h2>
                <p className="text-xs text-gray-500 mt-0.5">Control live data polling and developer diagnostics.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Dashboard Auto-Refresh Polling Rate</label>
                  <select
                    value={settings.dashboardRefreshRate}
                    onChange={(e) => handleInputChange('dashboardRefreshRate', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-green-300 rounded-md text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                  >
                    <option value="15s">Every 15 Seconds (Real-time)</option>
                    <option value="30s">Every 30 Seconds (Balanced)</option>
                    <option value="1m">Every 1 Minute</option>
                    <option value="manual">Manual Refresh Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-md border border-green-300">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">Developer Diagnostic Logs</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Enable detailed network and API debug traces in console.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('debugLogs', !settings.debugLogs)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.debugLogs ? 'bg-green-600 border-green-600' : 'bg-gray-200 border-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.debugLogs ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManageSettings;
