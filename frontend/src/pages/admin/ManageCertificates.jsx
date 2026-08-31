import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Award,
  Search,
  Filter,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Download,
  Eye,
  RefreshCw,
  X,
  ChevronRight,
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  CheckSquare,
  Square,
  ShieldCheck,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import {
  fetchWorkshopsForCertificates,
  fetchWorkshopStudents,
  sendBulkCertificatesApi,
  getCertificatePdfUrl
} from '../../services/certificateService';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CustomSelect = ({ value, onChange, options, defaultLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-2.5 pr-8 py-2.5 bg-slate-50 border rounded-md text-xs font-semibold text-slate-800 transition cursor-pointer flex items-center justify-between ${isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-emerald-400'}`}
      >
        <span className="truncate">{value === 'All' ? defaultLabel : value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 absolute right-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-y-auto max-h-60 py-1">
          <div
            onClick={() => { onChange('All'); setIsOpen(false); }}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition ${value === 'All' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
          >
            {defaultLabel}
          </div>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`px-3 py-1.5 text-xs font-semibold cursor-pointer transition ${value === opt ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ManageCertificates = () => {
  const [workshops, setWorkshops] = useState([]);
  const [isLoadingWorkshops, setIsLoadingWorkshops] = useState(true);

  // Filters
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Workshop State for Enrolled Students View
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  // Batch Sending State
  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [notification, setNotification] = useState(null);

  // Live Certificate Preview Modal State
  const [previewStudent, setPreviewStudent] = useState(null);

  // Load workshops list
  const loadWorkshopsData = async () => {
    setIsLoadingWorkshops(true);
    try {
      const data = await fetchWorkshopsForCertificates();
      setWorkshops(data || []);
    } catch (err) {
      console.error('Error loading workshops:', err);
    } finally {
      setIsLoadingWorkshops(false);
    }
  };

  useEffect(() => {
    loadWorkshopsData();
  }, []);

  // Available Years list (only >= 2026, removing 2025/2024 since project launches in Aug 2026)
  const availableYears = useMemo(() => {
    const years = new Set(['2026', '2027', '2028', '2029', '2030']);
    workshops.forEach(w => {
      if (w.startDate) {
        const y = new Date(w.startDate).getFullYear();
        if (!isNaN(y) && y >= 2026) years.add(y.toString());
      }
      if (w.dateParts && w.dateParts.year) {
        const y = parseInt(w.dateParts.year, 10);
        if (!isNaN(y) && y >= 2026) years.add(w.dateParts.year);
      }
    });
    return Array.from(years)
      .filter(y => parseInt(y, 10) >= 2026)
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }, [workshops]);

  // Available Months list (for 2026 or All, only August to December are shown since launch is Aug 2026)
  const availableMonths = useMemo(() => {
    if (selectedYear === '2026' || selectedYear === 'All') {
      return ['August', 'September', 'October', 'November', 'December'];
    }
    // For future years (2027, 2028, etc.), full 12 months are valid
    return MONTH_NAMES;
  }, [selectedYear]);

  // Auto-reset month if selected month is not in availableMonths
  useEffect(() => {
    if (selectedMonth !== 'All' && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth('All');
    }
  }, [selectedYear, availableMonths, selectedMonth]);

  // Date input min/max constraints (Strictly >= 2026-08-01)
  const dateInputConstraints = useMemo(() => {
    let min = '2026-08-01';
    let max = '';

    if (selectedYear !== 'All') {
      const yrNum = parseInt(selectedYear, 10);
      if (selectedMonth !== 'All') {
        const mIdx = MONTH_NAMES.indexOf(selectedMonth) + 1;
        const mStr = mIdx.toString().padStart(2, '0');
        min = `${selectedYear}-${mStr}-01`;
        const lastDay = new Date(yrNum, mIdx, 0).getDate();
        max = `${selectedYear}-${mStr}-${lastDay.toString().padStart(2, '0')}`;
      } else {
        if (selectedYear === '2026') {
          min = '2026-08-01';
          max = '2026-12-31';
        } else {
          min = `${selectedYear}-01-01`;
          max = `${selectedYear}-12-31`;
        }
      }
    }
    return { min, max };
  }, [selectedYear, selectedMonth]);


  // Filtered Workshops based on Year, Month, Date, and Search Query
  const filteredWorkshops = useMemo(() => {
    return workshops.filter(w => {
      // 1. Text Search (College or Workshop Title)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const collegeMatch = (w.college || '').toLowerCase().includes(q);
        const titleMatch = (w.title || '').toLowerCase().includes(q);
        const addressMatch = (w.address || '').toLowerCase().includes(q);
        if (!collegeMatch && !titleMatch && !addressMatch) return false;
      }

      // Parse Date of Workshop
      const rawDateStr = w.startDate || w.date || '';
      let workshopYear = null;
      let workshopMonth = null;
      let workshopFullDate = null;

      if (rawDateStr) {
        const d = new Date(rawDateStr);
        if (!isNaN(d.getTime())) {
          workshopYear = d.getFullYear().toString();
          workshopMonth = (d.getMonth() + 1).toString(); // 1 to 12
          workshopFullDate = d.toISOString().split('T')[0];
        }
      }

      // If w.dateParts exists
      if (w.dateParts) {
        if (w.dateParts.year) workshopYear = w.dateParts.year;
        if (w.dateParts.month) workshopMonth = parseInt(w.dateParts.month, 10).toString();
        if (w.dateParts.fullDate) workshopFullDate = w.dateParts.fullDate;
      }

      // 2. Year Filter
      if (selectedYear !== 'All') {
        if (workshopYear !== selectedYear) return false;
      }

      // 3. Month Filter (Date is optional)
      if (selectedMonth !== 'All') {
        const targetMonthNum = (MONTH_NAMES.indexOf(selectedMonth) + 1).toString();
        if (workshopMonth !== targetMonthNum) return false;
      }

      // 4. Exact Date Filter (Optional)
      if (selectedDate) {
        if (workshopFullDate !== selectedDate) return false;
      }

      return true;
    });
  }, [workshops, selectedYear, selectedMonth, selectedDate, searchQuery]);

  // Calculate Counter Box Title & Subtitle
  const counterInfo = useMemo(() => {
    let label = 'Total Workshops';
    if (selectedDate) {
      const d = new Date(selectedDate);
      const formatted = !isNaN(d.getTime())
        ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : selectedDate;
      label = `Workshops on ${formatted}`;
    } else if (selectedYear !== 'All' && selectedMonth !== 'All') {
      label = `Workshops in ${selectedMonth} ${selectedYear}`;
    } else if (selectedYear !== 'All') {
      label = `Workshops in ${selectedYear}`;
    } else if (selectedMonth !== 'All') {
      label = `Workshops in ${selectedMonth}`;
    }
    return {
      label,
      count: filteredWorkshops.length
    };
  }, [selectedYear, selectedMonth, selectedDate, filteredWorkshops]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedYear('All');
    setSelectedMonth('All');
    setSelectedDate('');
    setSearchQuery('');
  };

  // Open Enrolled Students view for a specific workshop
  const handleSelectWorkshop = async (workshop) => {
    setSelectedWorkshop(workshop);
    setIsLoadingStudents(true);
    setSelectedStudentIds([]);
    setStudentSearchQuery('');
    try {
      const res = await fetchWorkshopStudents(workshop.id);
      if (res && res.data) {
        setStudents(res.data);
        // Pre-select all students by default for quick 1-click send
        setSelectedStudentIds(res.data.map(s => s.id));
      }
    } catch (err) {
      console.error('Error fetching workshop students:', err);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  // Filter students by search
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return students;
    const q = studentSearchQuery.toLowerCase();
    return students.filter(s =>
      (s.studentName || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q) ||
      (s.passCode || '').toLowerCase().includes(q)
    );
  }, [students, studentSearchQuery]);

  // Handle Select All Checkbox
  const handleToggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    }
  };

  // Handle Single Student Checkbox
  const handleToggleStudent = (studentId) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds(prev => [...prev, studentId]);
    }
  };

  // Trigger Bulk Certificate Dispatch
  const handleSendCertificates = async () => {
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student to send certificates.');
      return;
    }

    const confirmMsg = `Send official workshop certificates to ${selectedStudentIds.length} enrolled student(s) via Gmail?`;
    if (!window.confirm(confirmMsg)) return;

    setIsSendingBulk(true);
    setBulkProgress({ current: 0, total: selectedStudentIds.length });

    try {
      const res = await sendBulkCertificatesApi(selectedWorkshop.id, selectedStudentIds);
      if (res && res.success) {
        setNotification({
          type: 'success',
          message: `Successfully processed ${res.results.length} certificates! (${res.successCount} Sent, ${res.failedCount} Failed)`
        });

        // Update local student statuses
        const resultMap = new Map((res.results || []).map(r => [r.applicationId, r]));
        setStudents(prev =>
          prev.map(s => {
            const r = resultMap.get(s.id);
            if (r) {
              return {
                ...s,
                certificate: {
                  ...s.certificate,
                  status: r.status,
                  errorMessage: r.errorMessage,
                  sentAt: r.sentAt || new Date().toISOString(),
                  certificateCode: r.certificateCode || s.certificate.certificateCode
                }
              };
            }
            return s;
          })
        );
        // Refresh workshops list in background
        loadWorkshopsData();
      } else {
        setNotification({
          type: 'error',
          message: res.error || 'Failed to dispatch bulk certificates.'
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: `Error sending certificates: ${err.message}`
      });
    } finally {
      setIsSendingBulk(false);
      setTimeout(() => setNotification(null), 7000);
    }
  };

  // Single Student Retry / Send
  const handleSendSingleCertificate = async (student) => {
    setIsSendingBulk(true);
    try {
      const res = await sendBulkCertificatesApi(selectedWorkshop.id, [student.id]);
      if (res && res.success && res.results && res.results.length > 0) {
        const r = res.results[0];
        setStudents(prev =>
          prev.map(s => (s.id === student.id ? {
            ...s,
            certificate: {
              ...s.certificate,
              status: r.status,
              errorMessage: r.errorMessage,
              sentAt: r.sentAt,
              certificateCode: r.certificateCode || s.certificate.certificateCode
            }
          } : s))
        );
        if (r.success) {
          setNotification({ type: 'success', message: `Certificate sent successfully to ${student.email}` });
        } else {
          setNotification({ type: 'error', message: `Failed to deliver to ${student.email}: ${r.errorMessage}` });
        }
      }
    } catch (err) {
      setNotification({ type: 'error', message: `Error: ${err.message}` });
    } finally {
      setIsSendingBulk(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-4 animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-3 px-4 rounded-md flex items-center justify-between border shadow-md ${notification.type === 'success'
          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
          : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}>
          <div className="flex items-center space-x-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium text-xs md:text-sm">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View: Workshop List OR Enrolled Students View */}
      {!selectedWorkshop ? (
        <>
          {/* Top Page Header (Compact) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0B1B3D] to-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  Manage Certificates
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  Filter college workshops, review enrolled student batches, and dispatch verified certificates to student Gmail IDs.
                </p>
              </div>
            </div>

            <button
              onClick={loadWorkshopsData}
              disabled={isLoadingWorkshops}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition text-xs shrink-0 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWorkshops ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Dynamic Filter Bar & Workshop Live Counter Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Filter Controls Card (8 cols) */}
            <div className="lg:col-span-9 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-1.5 text-slate-800 font-bold text-lg">
                  <Filter className="w-5 h-5 text-emerald-500" />
                  <span>Workshop Filter</span>
                </div>

                {(selectedYear !== 'All' || selectedMonth !== 'All' || selectedDate || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset Filter</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {/* Year Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Year
                  </label>
                  <CustomSelect
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={availableYears}
                    defaultLabel="All Years"
                  />
                </div>

                {/* Month Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Month
                  </label>
                  <CustomSelect
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    options={availableMonths}
                    defaultLabel="All Months"
                  />
                </div>

                {/* Exact Date Picker (Optional, Min: Aug 2026) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Date <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="date"
                    min={dateInputConstraints.min}
                    max={dateInputConstraints.max || undefined}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition cursor-pointer"
                  />
                </div>

                {/* Search Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Search College
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Pune, COEP..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Workshop Counter Box (4 cols) - Clean White with Charcoal Border */}
            <div className="lg:col-span-3 bg-white p-3.5 px-4 rounded-md shadow-sm flex flex-col justify-between border border-slate-200 relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                    Live Workshop Count
                  </span>
                  <Award className="w-4 h-4 text-slate-700" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium line-clamp-1">
                  {counterInfo.label}
                </p>
              </div>

              <div className="mt-2.5 flex items-baseline space-x-2">
                <span className="text-3xl lg:text-4xl font-medium text-slate-900 tracking-tight">
                  {counterInfo.count}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  {counterInfo.count === 1 ? 'Workshop Found' : 'Workshops Found'}
                </span>
              </div>
            </div>
          </div>

          {/* College Workshops Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                <span>Colleges & Workshop Batches</span>
              </h2>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Showing {filteredWorkshops.length} of {workshops.length} Workshops
              </span>
            </div>

            {isLoadingWorkshops ? (
              <div className="bg-white p-10 rounded-md border border-slate-200 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                <p className="text-slate-600 font-medium text-xs">Loading workshops & enrollment database...</p>
              </div>
            ) : filteredWorkshops.length === 0 ? (
              <div className="bg-white p-10 rounded-md border border-dashed border-slate-300 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Filter className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Workshops Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No college workshops match your selected filter criteria. Try adjusting the year, month, or date filter above.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition mt-1"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredWorkshops.map(workshop => {
                  const enrolled = workshop.enrolledCount || 0;
                  const capacity = workshop.seatCapacity || 100;
                  const isFull = workshop.isSeatsFull || enrolled >= capacity;
                  const sentCerts = workshop.certificates ? workshop.certificates.sentCount : 0;

                  return (
                    <div
                      key={workshop.id}
                      className="bg-white rounded-md border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all p-4 flex flex-col justify-between group cursor-pointer"
                      onClick={() => handleSelectWorkshop(workshop)}
                    >
                      <div className="space-y-2.5">
                        {/* Status & Seat Capacity Header */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex items-center space-x-1.5 ${isFull
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
                            <span>{enrolled}/{capacity} Seats Full</span>
                          </span>

                          <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{workshop.date || workshop.startDate || 'Upcoming'}</span>
                          </span>
                        </div>

                        {/* College & Title */}
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition line-clamp-1">
                            {workshop.college || 'Institution Workshop'}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                            {workshop.title || 'AI Summit Hands-on Workshop'}
                          </p>
                          {workshop.address && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                              📍 {workshop.address}
                            </p>
                          )}
                        </div>

                        {/* Certificate Dispatch Metrics */}
                        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-400 font-medium block text-[10px] uppercase">Certificates</span>
                            <span className="font-bold text-slate-800 text-xs">
                              {sentCerts} / {enrolled} Sent
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 font-medium block text-[10px] uppercase">Eligible</span>
                            <span className="font-bold text-emerald-600 text-xs">
                              {enrolled} Paid
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition flex items-center space-x-1">
                          <span>View Enrolled Students</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                        <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Enrolled Students Detail View (Compact & Clean) */
        <div className="space-y-3.5">
          {/* Header with Back Button */}
          <div className="bg-white p-3.5 px-4 rounded-md border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedWorkshop(null)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition shrink-0"
                title="Back to Workshops List"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Workshop Cohort
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    📅 {selectedWorkshop.date || selectedWorkshop.startDate || 'August 2026'}
                  </span>
                </div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 mt-0.5">
                  {selectedWorkshop.college}
                </h1>
                <p className="text-xs text-slate-500">
                  {selectedWorkshop.title} • <strong className="text-slate-800">{students.length} Enrolled Paid Students</strong>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2.5 self-end sm:self-auto">
              <button
                onClick={() => handleSelectWorkshop(selectedWorkshop)}
                disabled={isLoadingStudents || isSendingBulk}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Refresh student list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStudents ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleSendCertificates}
                disabled={isSendingBulk || selectedStudentIds.length === 0}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs rounded-md shadow-md shadow-emerald-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingBulk ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Certificates ({selectedStudentIds.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Student Search & Select All Header */}
          <div className="bg-white p-3 px-4 rounded-md border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <button
                onClick={handleToggleSelectAll}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                  <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Select All ({selectedStudentIds.length}/{filteredStudents.length})</span>
              </button>

              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {selectedStudentIds.length} students selected
              </span>
            </div>

            {/* Student Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search by name, gmail, pass ID..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
            </div>
          </div>

          {/* Enrolled Students Table */}
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">

            {isLoadingStudents ? (
              <div className="p-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-slate-600 font-medium text-sm">Loading enrolled students list...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Enrolled Students Found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  No verified paid student applications recorded for this workshop yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600">
                      <th className="py-3.5 px-4 w-12 text-center">
                        <button onClick={handleToggleSelectAll} className="p-1">
                          {selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </th>
                      <th className="py-3.5 px-4">Student Details</th>
                      <th className="py-3.5 px-4">Contact & Gmail ID</th>
                      <th className="py-3.5 px-4">Academic Info</th>
                      <th className="py-3.5 px-4">Certificate Delivery Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {filteredStudents.map((student) => {
                      const isSelected = selectedStudentIds.includes(student.id);
                      const certStatus = student.certificate ? student.certificate.status : 'Pending';
                      const isSent = certStatus === 'Sent';
                      const isFailed = certStatus === 'Failed';

                      return (
                        <tr
                          key={student.id}
                          className={`hover:bg-blue-50/30 transition ${isSelected ? 'bg-blue-50/20' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleToggleStudent(student.id)}
                              className="p-1 text-slate-400 hover:text-emerald-600"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </button>
                          </td>

                          {/* Student Name */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                {student.studentName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">
                                  {student.studentName}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  Pass: {student.passCode || student.id.slice(0, 8)}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Gmail & Phone */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="flex items-center space-x-1.5 text-xs text-slate-700 font-semibold">
                                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span>{student.email}</span>
                              </span>
                              <span className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{student.phone || 'N/A'}</span>
                              </span>
                            </div>
                          </td>

                          {/* Academic */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold text-slate-800 block">
                                {student.branch || 'Computer Science'}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {student.year || '3rd Year'}
                              </span>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-4">
                            {isSent ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Sent to Gmail</span>
                                </span>
                                {student.certificate.sentAt && (
                                  <span className="text-[10px] text-slate-400 block ml-1">
                                    {new Date(student.certificate.sentAt).toLocaleString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                )}
                              </div>
                            ) : isFailed ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-300">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Delivery Failed</span>
                                </span>
                                <p className="text-[11px] text-rose-600 font-medium">
                                  {student.certificate.errorMessage || 'Mail not delivered / Invalid Gmail'}
                                </p>
                              </div>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Ready to Send</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => setPreviewStudent(student)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 rounded-lg text-xs font-semibold transition"
                              title="Preview Dummy Certificate"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>

                            <button
                              onClick={() => handleSendSingleCertificate(student)}
                              disabled={isSendingBulk}
                              className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${isFailed
                                ? 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                                : isSent
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                }`}
                              title="Dispatch / Resend Certificate"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>{isFailed ? 'Retry' : isSent ? 'Resend' : 'Send'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live Certificate Interactive Preview Modal */}
      {previewStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden space-y-4 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Certificate Live Preview</h3>
              </div>
              <button
                onClick={() => setPreviewStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* New Certificate Visual Rendering */}
            <div
              className="relative w-full overflow-hidden rounded-md border border-slate-200 shadow-md bg-white mx-auto [container-type:inline-size]"
              style={{ aspectRatio: '841.89 / 595.28', backgroundImage: 'url(/VMANOUS_Certificate_Final.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {/* Precise white masks to hide only the placeholder text without hiding logos or lines */}
              {/* SRN Mask - Wider to cover text on the left, but not so wide to hit VMANOUS */}
              <div className="absolute top-[4%] right-[4%] w-[28%] h-[9%] bg-white z-0"></div>
              {/* Name & Line Mask - Tall enough to completely hide 'Name of Candidates' and the original line */}
              <div className="absolute top-[37%] left-[20%] w-[60%] h-[15%] bg-white z-0"></div>
              {/* Paragraph Mask */}
              <div className="absolute top-[56%] left-[12%] w-[76%] h-[16%] bg-white z-0"></div>

              {/* SRN and Issue Date (Top Right) */}
              <div className="absolute top-[5.5%] right-[7%] text-right space-y-0.5 z-10">
                <p className="font-bold text-black" style={{ fontSize: '1.2cqi' }}>
                  SRN : {previewStudent.certificate ? previewStudent.certificate.certificateCode : 'VM-CERT-2026-001'}
                </p>
                <p className="font-medium text-black" style={{ fontSize: '1.2cqi' }}>
                  Issue Date: {new Date().toLocaleDateString('en-GB')}
                </p>
              </div>

              {/* Student Name (Center) */}
              <div className="absolute top-[37%] left-[20%] w-[60%] h-[15%] flex flex-col justify-end z-10">
                <h1 
                  className="text-black text-center leading-none mb-[1%]" 
                  style={{ fontFamily: "'Great Vibes', cursive", fontSize: '6cqi', fontWeight: '400' }}
                >
                  {previewStudent.studentName}
                </h1>
              </div>

              {/* Description Body Paragraph */}
              <div className="absolute top-[56%] left-[15%] w-[70%] text-center z-10 flex items-center justify-center h-[16%]">
                <p
                  className="text-[#334155] leading-relaxed uppercase"
                  style={{ fontSize: '1.45cqi', fontFamily: "'Cinzel', serif", letterSpacing: '0.12em', fontWeight: '500' }}
                >
                  FOR SUCCESSFULLY COMPLETING THE AI SUMMIT ON {selectedWorkshop ? (selectedWorkshop.date || selectedWorkshop.startDate) : 'AUG 24, 2026'}, WITH A TOTAL DURATION OF {selectedWorkshop ? selectedWorkshop.duration || '30' : '30'} HOURS, AND DEMONSTRATING ACTIVE PARTICIPATION IN EXPLORING AI TECHNOLOGIES, INDUSTRY INSIGHTS, AND PRACTICAL APPLICATIONS.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <a
                href={getCertificatePdfUrl(previewStudent.id)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-md transition"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>

              <button
                onClick={() => setPreviewStudent(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md shadow-sm transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCertificates;
