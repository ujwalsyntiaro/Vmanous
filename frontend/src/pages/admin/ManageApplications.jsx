import React, { useState, useEffect, useRef } from 'react';
import {

  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Building2,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  GraduationCap,
  MapPin,
  RefreshCw,
  X,
  ChevronDown
} from 'lucide-react';
import {
  getApplications,
  updateVerificationStatus,
  deleteApplication,
  exportApplicationsToCSV
} from '../../services/applicationService';
import { getSummits } from '../../services/summitService';
import DateInput from '../../components/ui/DateInput';


const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All'); // All, 7days, 30days, today
  const [activeTab, setActiveTab] = useState('All'); // All, Paid, Failed, Pending Audit
  const [selectedApp, setSelectedApp] = useState(null); // For Inspect Drawer / Modal

  // Contextual Dynamic Styling for Status Dropdown
  const getStatusStyles = (tab) => {
    switch (tab) {
      case 'Paid':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800 focus:ring-emerald-500/20 focus:border-emerald-500',
          iconColor: 'text-emerald-600',
          IconComponent: CheckCircle2
        };
      case 'Failed':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-800 focus:ring-rose-500/20 focus:border-rose-500',
          iconColor: 'text-rose-600',
          IconComponent: AlertCircle
        };
      case 'Pending Audit':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-900 focus:ring-amber-500/20 focus:border-amber-500',
          iconColor: 'text-amber-600',
          IconComponent: Clock
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200 text-slate-800 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4]',
          iconColor: 'text-[#2D73B4]',
          IconComponent: Filter
        };
    }
  };

  const currentStatusStyle = getStatusStyles(activeTab);
  const StatusIcon = currentStatusStyle.IconComponent;

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isCollegeOpen, setIsCollegeOpen] = useState(false);

  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const statusDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const collegeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateOpen(false);
      }
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
        setIsCollegeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const [summits, setSummits] = useState([]);

  useEffect(() => {
    setApplications(getApplications());
    setSummits(getSummits());
  }, []);

  const handleRefresh = () => {
    setApplications(getApplications());
    setSummits(getSummits());
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = updateVerificationStatus(id, newStatus);
    setApplications(updated);
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, verificationStatus: newStatus });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this application record?")) {
      const updated = deleteApplication(id);
      setApplications(updated);
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
      }
    }
  };

  // Filtering Logic
  const filteredApps = applications.filter((app) => {
    // College Filter
    if (selectedCollege !== 'All') {
      const target = selectedCollege.toLowerCase();
      const appCol = (app.collegeName || '').toLowerCase();
      if (!appCol.includes(target) && !target.includes(appCol)) {
        return false;
      }
    }

    // Tab Filter
    if (activeTab === 'Paid' && app.paymentStatus !== 'Paid') return false;
    if (activeTab === 'Failed' && app.paymentStatus !== 'Failed') return false;
    if (activeTab === 'Pending Audit' && app.verificationStatus !== 'Pending Audit') return false;

    // Date Range Filter
    if (selectedDateRange !== 'All' && app.createdAt) {
      const appDate = new Date(app.createdAt);
      const now = new Date();
      if (!isNaN(appDate.getTime())) {
        if (selectedDateRange === 'today') {
          if (appDate.toDateString() !== now.toDateString()) return false;
        } else if (selectedDateRange === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (appDate < sevenDaysAgo) return false;
        } else if (selectedDateRange === '30days') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (appDate < thirtyDaysAgo) return false;
        } else if (selectedDateRange === 'custom') {
          if (customStartDate) {
            const start = new Date(customStartDate);
            start.setHours(0, 0, 0, 0);
            if (appDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (appDate > end) return false;
          }
        }
      }
    }


    // Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = app.studentName?.toLowerCase().includes(q);
      const matchEmail = app.email?.toLowerCase().includes(q);
      const matchCollege = app.collegeName?.toLowerCase().includes(q);
      const matchTxn = app.transactionId?.toLowerCase().includes(q);
      return matchName || matchEmail || matchCollege || matchTxn;
    }
    return true;
  });

  const paidCount = applications.filter(a => a.paymentStatus === 'Paid').length;
  const failedCount = applications.filter(a => a.paymentStatus === 'Failed').length;
  const pendingAuditCount = applications.filter(a => a.verificationStatus === 'Pending Audit').length;

  // Dynamic Colleges List: Auto-expands whenever a new College/Workshop is added (5 -> 6 -> 7...)
  const allCollegeNames = Array.from(
    new Set([
      ...summits.map(s => s.college),
      ...applications.map(a => a.collegeName)
    ].filter(Boolean))
  ).sort();


  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Applications & Leads</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Audit student submissions, verify registrations, and follow up on failed payments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportApplicationsToCSV(filteredApps)}
            className="px-4 py-2 bg-[#2D73B4] text-white rounded-lg text-sm font-semibold hover:bg-[#235b8f] transition-colors flex items-center gap-2 shadow-md shadow-[#2D73B4]/20 cursor-pointer"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar & Dropdowns */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
          {/* Status Filter Custom Floating Dropdown */}
          <div className="relative w-full" ref={statusDropdownRef}>
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className={`relative w-full pl-9 pr-8 py-2 border rounded-lg text-xs font-extrabold outline-none cursor-pointer transition-all text-left ${currentStatusStyle.bg}`}
            >
              <StatusIcon size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStatusStyle.iconColor}`} />
              <span className="block truncate pr-2">
                {activeTab === 'All' && `All Statuses (${applications.length})`}
                {activeTab === 'Paid' && `Paid Registrations (${paidCount})`}
                {activeTab === 'Failed' && `Failed Payments (${failedCount})`}
                {activeTab === 'Pending Audit' && `Pending Audit (${pendingAuditCount})`}
              </span>
              <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
            </button>

            {isStatusOpen && (
              <div className="absolute left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => { setActiveTab('All'); setIsStatusOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${activeTab === 'All' ? 'bg-slate-100 text-slate-900 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Filter size={14} className="text-[#2D73B4]" />
                  <span>All Statuses ({applications.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('Paid'); setIsStatusOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${activeTab === 'Paid' ? 'bg-emerald-100 text-emerald-900 font-extrabold' : 'text-emerald-800 hover:bg-emerald-50'
                    }`}
                >
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Paid Registrations ({paidCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('Failed'); setIsStatusOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${activeTab === 'Failed' ? 'bg-rose-100 text-rose-900 font-extrabold' : 'text-rose-800 hover:bg-rose-50'
                    }`}
                >
                  <AlertCircle size={14} className="text-rose-600" />
                  <span>Failed Payments ({failedCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('Pending Audit'); setIsStatusOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${activeTab === 'Pending Audit' ? 'bg-amber-100 text-amber-950 font-extrabold' : 'text-amber-900 hover:bg-amber-50'
                    }`}
                >
                  <Clock size={14} className="text-amber-600" />
                  <span>Pending Audit ({pendingAuditCount})</span>
                </button>
              </div>
            )}
          </div>

          {/* Custom Date Range Selector Dropdown */}
          <div className="relative w-full" ref={dateDropdownRef}>
            <button
              type="button"
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="relative w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer transition-all text-left hover:bg-gray-100"
            >
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <span className="block truncate pr-2">
                {selectedDateRange === 'All' && 'All Time'}
                {selectedDateRange === '7days' && 'Last 7 Days (1 Week)'}
                {selectedDateRange === '30days' && 'Last 30 Days (1 Month)'}
                {selectedDateRange === 'today' && 'Today'}
                {selectedDateRange === 'custom' && 'Custom Date Range'}
              </span>
              <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isDateOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDateOpen && (
              <div className="absolute left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => { setSelectedDateRange('All'); setIsDateOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${selectedDateRange === 'All' ? 'bg-slate-100 text-slate-900 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  All Time
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedDateRange('7days'); setIsDateOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${selectedDateRange === '7days' ? 'bg-slate-100 text-slate-900 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  Last 7 Days (1 Week)
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedDateRange('30days'); setIsDateOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${selectedDateRange === '30days' ? 'bg-slate-100 text-slate-900 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  Last 30 Days (1 Month)
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedDateRange('today'); setIsDateOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${selectedDateRange === 'today' ? 'bg-slate-100 text-slate-900 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedDateRange('custom'); setIsDateOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer text-[#2D73B4] ${selectedDateRange === 'custom' ? 'bg-blue-50 font-extrabold' : 'hover:bg-blue-50/50'
                    }`}
                >
                  Custom Date Range (From - To)
                </button>
              </div>
            )}
          </div>

          {/* Custom Partner College Selector Dropdown */}
          <div className="relative w-full" ref={collegeDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCollegeOpen(!isCollegeOpen)}
              className="relative w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer transition-all text-left hover:bg-gray-100"
            >
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <span className="block truncate pr-2">{selectedCollege === 'All' ? 'All Partner Colleges' : selectedCollege}</span>
              <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isCollegeOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCollegeOpen && (
              <div className="absolute left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 space-y-0.5 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => { setSelectedCollege('All'); setIsCollegeOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${selectedCollege === 'All' ? 'bg-slate-100 text-slate-900 font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  All Partner Colleges
                </button>
                {allCollegeNames.map((name, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setSelectedCollege(name); setIsCollegeOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer truncate ${selectedCollege === name ? 'bg-blue-50 text-[#2D73B4] font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student, email, txn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4]"
            />
          </div>
        </div>

        {/* Custom Date Range Picker (From - To) Sub-Row */}
        {selectedDateRange === 'custom' && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-200">
            <div className="flex-1 w-full flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 shrink-0">From Date:</span>
              <DateInput
                name="customStartDate"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-[#2D73B4]/20"
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 shrink-0">To Date:</span>
              <DateInput
                name="customEndDate"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-[#2D73B4]/20"
                placeholder="DD/MM/YYYY"
              />
            </div>
            <button
              type="button"
              onClick={() => { setCustomStartDate(''); setCustomEndDate(''); }}
              className="text-xs text-rose-600 hover:underline font-semibold shrink-0 cursor-pointer"
            >
              Reset Dates
            </button>
          </div>
        )}
      </div>

      {/* Applications Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">College & Venue</th>
                <th className="py-3.5 px-4">Program</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    No application records match your selected filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">

                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.selfiePhotoUrl}
                          alt={app.studentName}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-xs"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{app.studentName}</p>
                          <p className="text-[11px] text-slate-500">{app.email} &bull; {app.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* College & Venue */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 line-clamp-1">{app.collegeName}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{app.venueLocation || 'Main Campus'}</span>
                      </p>
                    </td>

                    {/* Program */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 bg-gray-100 px-2.5 py-1 rounded-md text-[11px]">
                        {app.programTitle}
                      </span>
                    </td>

                    {/* Payment Status Badge */}
                    <td className="py-3.5 px-4">
                      {app.paymentStatus === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={12} />
                          Paid (₹{app.amountPaid || 2358})
                        </span>
                      ) : app.paymentStatus === 'Failed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                          <AlertCircle size={12} />
                          Payment Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          <Clock size={12} />
                          Pending Payment
                        </span>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="py-3.5 px-4">
                      {app.verificationStatus === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Verified
                        </span>
                      ) : app.verificationStatus === 'Flagged' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                          Pending Audit
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-[#2D73B4] hover:text-white rounded-lg text-slate-700 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={14} />
                          Inspect
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Student Profile Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Student Application Details</h3>
                  <p className="text-xs text-slate-500">ID: {selectedApp.id} &bull; Transaction: {selectedApp.transactionId || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-gray-400 hover:text-slate-800 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">

              {/* Top Banner: Student Selfie & Essential Info */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={selectedApp.selfiePhotoUrl}
                  alt={selectedApp.studentName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-bold text-slate-900 text-lg">{selectedApp.studentName}</h4>
                  <p className="text-xs text-slate-600 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail size={13} className="text-slate-400" />
                    {selectedApp.email}
                  </p>
                  <p className="text-xs text-slate-600 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone size={13} className="text-slate-400" />
                    {selectedApp.phone}
                  </p>
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                    {selectedApp.paymentStatus === 'Paid' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        Paid (₹{selectedApp.amountPaid || 2358})
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        Payment Failed ({selectedApp.paymentFailureReason || 'Cancelled'})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic & Venue Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Institution / College</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedApp.collegeName}</p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Venue Location</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedApp.venueLocation || 'Main Campus'}</p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Branch & Degree</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedApp.degree} &bull; {selectedApp.branch}</p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Academic Marks %</p>
                  <p className="font-bold text-slate-800 text-sm">10th: {selectedApp.marksTenth || 'N/A'} | 12th/Diploma: {selectedApp.marksTwelfth || 'N/A'}</p>
                </div>

              </div>

              {/* Action Buttons for Verification */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'Verified')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    Verify Record
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'Flagged')}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <AlertCircle size={16} />
                    Flag Record
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(selectedApp.id)}
                  className="px-3 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageApplications;
