import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, CheckCircle2, Building2, LayoutGrid, List, Receipt, DollarSign, History, Users, ChevronDown, Download, X, Search, Key, AlertCircle } from 'lucide-react';
import { getSummits, fetchSummitsAsync, addSummit, updateSummit, deleteSummit, formatEventDates, isSummitActive, isCollegeMatch } from '../../services/summitService';
import { getApplications, saveApplications } from '../../services/applicationService';
import ProgramCard from '../../components/ui/ProgramCard';
import DateInput, { isoToDDMMYYYY, isValidDDMMYYYY } from '../../components/ui/DateInput';

const parseTimeStr = (timeStr) => {
  if (!timeStr) {
    return {
      startTime: "10:00",
      startAmPm: "AM",
      endTime: "05:00",
      endAmPm: "PM",
    };
  }
  const match = timeStr.match(
    /^(\d{1,2}:\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)/i,
  );
  if (match) {
    return {
      startTime: match[1],
      startAmPm: match[2].toUpperCase(),
      endTime: match[3],
      endAmPm: match[4].toUpperCase(),
    };
  }
  return {
    startTime: "10:00",
    startAmPm: "AM",
    endTime: "05:00",
    endAmPm: "PM",
  };
};

const ManagePrograms = () => {
  const [summits, setSummits] = useState(() => getSummits());
  const [applications, setApplications] = useState(() => getApplications());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [historyModalSummit, setHistoryModalSummit] = useState(null);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [formError, setFormError] = useState("");

  const [otpValue, setOtpValue] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [rescheduleEmail, setRescheduleEmail] = useState('');
  const [rescheduleStep, setRescheduleStep] = useState('email');
  const [rescheduleEmailError, setRescheduleEmailError] = useState('');

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    totalHours: "",
    durationDays: 2,
    startTime: "10:00",
    startAmPm: "AM",
    endTime: "05:00",
    endAmPm: "PM",
    startDate: "",
    endDate: "",
    date: "",
    college: "",
    address: "",
    status: "Registration Open",
    type: "Flagship Event",
    entryCode: "",
    seatCapacity: 100,
    price: 1999,
    originalPrice: 4999,
    taxRate: 18,
    taxMode: "Exclusive",
    processingFee: 0,
    processingFeeType: "Percentage",
    features: "",
    scheduleStatus: "Scheduled",
  });

  const loadSummits = async () => {
    try {
      const resApps = await fetch("/api/v1/applications");
      const jsonApps = await resApps.json();
      if (jsonApps.success && Array.isArray(jsonApps.data)) {
        saveApplications(jsonApps.data);
        setApplications(jsonApps.data);
      } else {
        setApplications(getApplications());
      }
    } catch (err) {
      setApplications(getApplications());
    }

    const data = await fetchSummitsAsync();
    setSummits(data);
  };

  const openHistoryStudentsModal = async (summit) => {
    try {
      const resApps = await fetch("/api/v1/applications");
      const jsonApps = await resApps.json();
      if (jsonApps.success && Array.isArray(jsonApps.data)) {
        saveApplications(jsonApps.data);
        setApplications(jsonApps.data);
      }
    } catch (err) { }

    setHistoryModalSummit(summit);
    setHistorySearchQuery("");
  };

  const getAttendeesForSummit = (summit, appsList = applications) => {
    if (!summit) return [];

    return appsList.filter((app) => {
      if (app.paymentStatus && app.paymentStatus !== "Paid") return false;

      // 1. Explicit summitId match
      if (app.summitId !== null && app.summitId !== undefined && Number(app.summitId) === Number(summit.id)) {
        return true;
      }

      // 2. Primary College match
      if (summit.college && isCollegeMatch(app.collegeName, summit.college)) {
        return true;
      }

      return false;
    });
  };

  const exportSummitAttendeesToExcel = (summit, attendees) => {
    if (!summit || !Array.isArray(attendees) || attendees.length === 0) return;

    const sanitize = (str) => String(str || "").replace(/[^a-zA-Z0-9_\- ]/g, "_");
    const fileName = `${sanitize(summit.college || "College")}_${sanitize(summit.title || "Summit")}_Enrolled_Students.xls`;

    let table = `<table border="1">
      <thead>
        <tr style="background-color: #047857; color: #ffffff; font-weight: bold; text-align: left;">
          <th>#</th>
          <th>Student Name</th>
          <th>Email Address</th>
          <th>Phone Number</th>
          <th>College Name</th>
          <th>Program Title</th>
          <th>Degree & Branch</th>
          <th>Pass Code</th>
          <th>Amount Paid (INR)</th>
          <th>Payment Status</th>
          <th>Verification Status</th>
          <th>Registration Date</th>
        </tr>
      </thead>
      <tbody>`;

    attendees.forEach((app, idx) => {
      const name = app.studentName || app.name || "Student";
      const email = app.email || "-";
      const phone = app.phone || "-";
      const col = app.collegeName || summit.college || "-";
      const prog = app.programTitle || summit.title || "-";
      const deg = `${app.degree || "B.Tech"} - ${app.branch || "CSE"}`;
      const pass = app.passCode || "PASS-VERIFIED";
      const amt = Number(app.amountPaid || app.amount || summit.price || 1999).toLocaleString('en-IN');
      const payStatus = app.paymentStatus || "Paid";
      const verStatus = app.verificationStatus || "Verified";
      const regDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

      table += `<tr>
        <td>${idx + 1}</td>
        <td>${name}</td>
        <td>${email}</td>
        <td>'${phone}</td>
        <td>${col}</td>
        <td>${prog}</td>
        <td>${deg}</td>
        <td>${pass}</td>
        <td>₹${amt}</td>
        <td>${payStatus}</td>
        <td>${verStatus}</td>
        <td>${regDate}</td>
      </tr>`;
    });

    table += `</tbody></table>`;

    const blob = new Blob([`\ufeff${table}`], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadSummits();
    window.addEventListener("summits_updated", loadSummits);
    window.addEventListener("applications_updated", loadSummits);

    let bc = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("vmanous_live_updates");
      bc.onmessage = (msg) => {
        if (msg.data?.type === "SUMMIT_UPDATED") {
          loadSummits();
        }
      };
    }

    const syncInterval = setInterval(() => {
      loadSummits();
    }, 5000);

    return () => {
      window.removeEventListener("summits_updated", loadSummits);
      window.removeEventListener("applications_updated", loadSummits);
      if (bc) bc.close();
      clearInterval(syncInterval);
    };
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormError("");
    setFormData({
      title: "",
      subtitle: "",
      totalHours: "",
      durationDays: 2,
      startTime: "10:00",
      startAmPm: "AM",
      endTime: "05:00",
      endAmPm: "PM",
      startDate: "",
      endDate: "",
      date: "",
      college: "",
      address: "",
      status: "Registration Open",
      type: "Flagship Event",
      entryCode: "",
      seatCapacity: 100,
      price: 1999,
      originalPrice: 4999,
      taxRate: 18,
      taxMode: "Exclusive",
      processingFee: 0,
      processingFeeType: "Percentage",
      features: "",
      scheduleStatus: "Scheduled",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (summit) => {
    setEditingId(summit.id);
    setFormError("");
    const parsedDays = parseInt(summit.duration) || 2;
    const timeParsed = parseTimeStr(summit.time);
    let parsedHours = (summit.totalHours !== undefined && summit.totalHours !== null) ? String(summit.totalHours) : "";
    if (!parsedHours && summit.duration) {
      const hMatch = String(summit.duration).match(/(\d+)\s*(?:hrs|hours)/i);
      if (hMatch) parsedHours = hMatch[1];
    }
    setFormData({
      title: summit.title || "",
      subtitle: summit.subtitle || "",
      totalHours: parsedHours,
      durationDays: parsedDays,
      startTime: timeParsed.startTime,
      startAmPm: timeParsed.startAmPm,
      endTime: timeParsed.endTime,
      endAmPm: timeParsed.endAmPm,
      startDate: summit.startDate || "",
      endDate: summit.endDate || "",
      date: summit.date || "",
      college: summit.college || "",
      address: summit.address || "",
      status: summit.status || "Registration Open",
      type: summit.type || "Flagship Event",
      entryCode: summit.entryCode || "",
      seatCapacity:
        summit.seatCapacity !== undefined ? summit.seatCapacity : 100,
      price: summit.price !== undefined ? summit.price : 1999,
      originalPrice: summit.originalPrice || 4999,
      taxRate: summit.taxRate !== undefined ? summit.taxRate : 18,
      taxMode: summit.taxMode || "Exclusive",
      processingFee: (summit.processingFee !== undefined && summit.processingFee !== null) ? summit.processingFee : 0,
      processingFeeType: (summit.processingFeeType && summit.processingFeeType !== 'Fixed') ? summit.processingFeeType : "Percentage",
      features: (summit.features || []).join("\n"),
      scheduleStatus: summit.scheduleStatus || "Scheduled",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      deleteSummit(id);
      setSummits(getSummits());
    }
  };

  const handleInputChange = async (e) => {
    setFormError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // If selecting Reschedule/Postpone and editing an existing summit
    if (e.target.name === "scheduleStatus" && (e.target.value === "Rescheduled" || e.target.value === "Postponed") && editingId) {
      setRescheduleStep('email');
      setRescheduleEmail('');
      setRescheduleEmailError('');
      setOtpValue('');
      setIsRescheduleModalOpen(true);
    } else if (e.target.name === "scheduleStatus" && (e.target.value === "Rescheduled" || e.target.value === "Postponed")) {
      // If creating a new summit, just open modal but don't send API (no editingId)
      setIsRescheduleModalOpen(true);
    }
  };

  const handleSendOtp = async () => {
    setRescheduleEmailError('');
    if (!rescheduleEmail) {
      setRescheduleEmailError("Please enter an email address.");
      return;
    }

    if (rescheduleEmail.toLowerCase() !== 'am@vmanous.com') {
      setRescheduleEmailError("Invalid email address. Please enter the authorized admin email.");
      return;
    }
    
    setIsSendingOtp(true);

    // Calculate derived data for API
    const days = parseInt(formData.durationDays) || 1;
    const duration = `${days}-Day Live Workshop`;
    const timeStr = `${formData.startTime || "10:00"} ${formData.startAmPm || "AM"} - ${formData.endTime || "05:00"} ${formData.endAmPm || "PM"}`;
    const finalEndDate = formData.endDate || formData.startDate;
    const formattedDate = formData.startDate || formData.endDate ? formatEventDates(formData.startDate, finalEndDate) : formData.date;

    const summitData = {
      ...formData,
      scheduleStatus: formData.scheduleStatus,
      status: formData.scheduleStatus, // Update main status too
      totalHours: formData.totalHours ? String(formData.totalHours).trim() : "",
      duration: duration,
      time: timeStr,
      date: formattedDate,
    };

    try {
      const res = await fetch('/api/summits/send-reschedule-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summitId: editingId, newData: summitData, email: rescheduleEmail })
      });
      const data = await res.json();
      if (data.success) {
        setRescheduleStep('otp');
      } else {
        alert(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('Failed to send OTP', err);
      alert('Error sending OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!editingId) {
      // If it's a new workshop, just close modal and let them save normally
      setIsRescheduleModalOpen(false);
      return;
    }

    if (!otpValue || otpValue.trim() === '') {
      alert("Please enter the OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch('/api/summits/verify-reschedule-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summitId: editingId, otp: otpValue, message: "Workshop schedule has been updated." })
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message || 'Rescheduled successfully and emails sent!');
        setIsRescheduleModalOpen(false);
        setOtpValue('');
        loadSummits();
        setIsModalOpen(false); // Close main edit modal
      } else {
        alert(data.error || 'Failed to verify OTP.');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying OTP.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (formData.startDate) {
      const startDisp = isoToDDMMYYYY(formData.startDate);
      if (!isValidDDMMYYYY(startDisp)) {
        setFormError("Please enter a valid Start Date in DD/MM/YYYY format.");
        return;
      }
    }

    if (formData.endDate) {
      const endDisp = isoToDDMMYYYY(formData.endDate);
      if (!isValidDDMMYYYY(endDisp)) {
        setFormError("Please enter a valid End Date in DD/MM/YYYY format.");
        return;
      }
    }

    const days = parseInt(formData.durationDays) || 1;
    const duration = `${days}-Day Live Workshop`;
    const timeStr = `${formData.startTime || "10:00"} ${formData.startAmPm || "AM"} - ${formData.endTime || "05:00"} ${formData.endAmPm || "PM"}`;

    const finalEndDate = formData.endDate || formData.startDate;
    const formattedDate =
      formData.startDate || formData.endDate
        ? formatEventDates(formData.startDate, finalEndDate)
        : formData.date;

    const featStr = typeof formData.features === 'string' ? formData.features : '';
    const normalizedEntryCode = formData.entryCode ? String(formData.entryCode).trim().toUpperCase() : "";

    // Client-side Duplicate Check across current loaded workshops
    if (normalizedEntryCode) {
      const duplicate = summits.find(s =>
        s.entryCode &&
        String(s.entryCode).trim().toUpperCase() === normalizedEntryCode &&
        (editingId ? (s.id !== editingId && Number(s.id) !== Number(editingId)) : true)
      );
      if (duplicate) {
        setFormError(`Entry code '${normalizedEntryCode}' is already assigned to "${duplicate.college || duplicate.title}". Please use a unique code.`);
        return;
      }
    }

    const summitData = {
      ...formData,
      entryCode: normalizedEntryCode,
      totalHours: formData.totalHours ? String(formData.totalHours).trim() : "",
      duration: duration,
      time: timeStr,
      date: formattedDate,
      seatCapacity: Number(formData.seatCapacity || 100),
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      taxRate: Number(formData.taxRate),
      processingFee: Number(formData.processingFee),
      processingFeeType: formData.processingFeeType || "Percentage",
      features: featStr.split("\n").filter((f) => f.trim() !== ""),
      scheduleStatus: formData.scheduleStatus || "Scheduled",
    };

    let result;
    if (editingId) {
      result = await updateSummit(editingId, summitData);
    } else {
      result = await addSummit(summitData);
    }

    if (result && !result.success) {
      setFormError(result.error || "Failed to save workshop. Please try again.");
      return;
    }

    setSummits(getSummits());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vmanous-navy-dark">
            Manage AI Summits
          </h1>
          <p className="text-gray-500 mt-1">
            Add, edit, or remove upcoming programs & pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-gray-100 text-vmanous-navy-dark" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-gray-100 text-vmanous-navy-dark" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D73B4] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium cursor-pointer"
          >
            <Plus size={18} />
            Create New
          </button>
        </div>
      </div>

      {/* 🟢 1. ACTIVE & UPCOMING WORKSHOPS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="text-base font-bold text-vmanous-navy-dark flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active & Upcoming Workshops ({summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').length})
          </h2>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').map((summit, index) => (
              <div key={summit.id} className="w-full">
                <ProgramCard
                  summit={summit}
                  index={index}
                  isAdmin={true}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              </div>
            ))}
            {summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100 text-sm">
                No active upcoming workshops right now.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Program Info</th>
                    <th className="px-6 py-4">College & Venue</th>
                    <th className="px-6 py-4">Pricing & Tax</th>
                    <th className="px-6 py-4">Schedule & Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').map((summit) => (
                    <tr key={summit.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-vmanous-navy-dark">{summit.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{summit.subtitle}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md">
                            {summit.type}
                          </span>
                          {summit.status && (
                            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-md border border-emerald-200">
                              {summit.status}
                            </span>
                          )}
                          {summit.entryCode && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-mono font-bold uppercase rounded-md border border-amber-200" title="Entry Code">
                              <Key size={11} className="text-amber-600" />
                              <span>{summit.entryCode}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-gray-400" />
                          <span className="font-medium">{summit.college}</span>
                        </div>
                        {summit.address && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin size={14} className="text-emerald-600 shrink-0" />
                            <span>{summit.address}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="font-bold text-emerald-600 text-sm">
                          ₹{Number(summit.price || 0).toLocaleString('en-IN')}
                          {summit.originalPrice && Number(summit.originalPrice) > Number(summit.price) && (
                            <span className="text-xs text-gray-400 line-through font-normal ml-2">
                              ₹{Number(summit.originalPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Receipt size={13} className="text-gray-400" />
                          <span>
                            {summit.taxMode === 'Inclusive' ? 'Tax Included' : summit.taxRate ? `+${summit.taxRate}% GST (${summit.taxMode || 'Exclusive'})` : 'Free'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{summit.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} className="text-emerald-600 shrink-0" />
                          <span>{summit.duration} {summit.time ? `(${summit.time})` : ''}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditModal(summit)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(summit.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No active workshops found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 📜 2. WORKSHOP HISTORY & PAST RECORDS */}
      <div className="space-y-4 pt-6 border-t border-gray-200 mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-vmanous-navy-dark flex items-center gap-2">
              <History size={20} className="text-amber-600" />
              <span>Workshop History & Past Records</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').length} Completed
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Archive of past completed workshops, event dates, and enrolled student stats.
            </p>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').map((summit, index) => (
              <div key={summit.id} className="w-full">
                <ProgramCard
                  summit={{
                    ...summit,
                    status: summit.status || 'Event Completed'
                  }}
                  index={index}
                  isAdmin={true}
                  isHistory={true}
                  onEdit={null}
                  onDelete={handleDelete}
                  onViewStudents={openHistoryStudentsModal}
                />
              </div>
            ))}
            {summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100 text-sm">
                No past workshop history available.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-amber-50/50 border-b border-gray-200 text-gray-700 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Past Program Info</th>
                    <th className="px-6 py-4">College & Venue</th>
                    <th className="px-6 py-4">Event Date (Kab Ka Tha)</th>
                    <th className="px-6 py-4">Enrolled Students</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').map((summit) => (
                    <tr key={summit.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-vmanous-navy-dark">{summit.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{summit.subtitle}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-md border border-amber-300">
                            {summit.status || 'Event Completed'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-gray-400" />
                          <span className="font-medium">{summit.college}</span>
                        </div>
                        {summit.address && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin size={14} className="text-emerald-600 shrink-0" />
                            <span>{summit.address}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-amber-600 shrink-0" />
                          <span className="font-bold text-gray-900">{summit.date}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {summit.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                          <Users size={14} className="text-emerald-600" />
                          <span>{summit.enrolledCount !== undefined ? summit.enrolledCount : 0} Students Enrolled</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => openHistoryStudentsModal(summit)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-md hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="View Enrolled Student Registration List"
                          >
                            <Users size={14} />
                            <span>Enrolled Student List ({summit.enrolledCount !== undefined ? summit.enrolledCount : 0})</span>
                          </button>
                          <button
                            onClick={() => handleDelete(summit.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete History Record"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No history records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal (Professional SaaS Layout) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Workshop Program" : "Create New Workshop"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure program schedule, venue, pricing, and capacity
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {formError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{formError}</div>
                </div>
              )}

              <form
                id="programForm"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Section 1: Basic Information */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                        placeholder="Title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Program Type <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                        placeholder="Program Type"
                      />
                    </div>
                  </div>

                  <div className="mt-3.5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Subtitle <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                      placeholder="Subtitle"
                    />
                  </div>
                </div>

                {/* Section 2: College, Location & Entry Code */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      College / Institution <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                      placeholder="College / Institution"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Venue Location
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                      placeholder="Venue Location"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-amber-600" />
                        <span>Entry Code</span>
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold uppercase">Unique</span>
                    </label>
                    <input
                      type="text"
                      name="entryCode"
                      value={formData.entryCode || ''}
                      onChange={(e) => {
                        setFormError('');
                        setFormData({ ...formData, entryCode: e.target.value.toUpperCase().replace(/\s+/g, '') });
                      }}
                      className="w-full h-10 px-3 font-mono font-bold uppercase bg-white border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs text-slate-900 tracking-wider placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 transition-all shadow-2xs"
                      placeholder="e.g. ABC20265"
                    />
                  </div>
                </div>

                {/* Section 3: Pricing & Tax Management Card */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Receipt className="w-4 h-4 text-[#2D73B4]" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Pricing & Tax Management
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Enrollment Fee (₹)
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-xs font-bold text-slate-400 select-none">₹</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full h-10 pl-7 pr-3 bg-white border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                          placeholder="Enrollment Fee"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        GST (%)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          name="taxRate"
                          value={formData.taxRate}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 pr-7 bg-white border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-semibold text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                          placeholder="GST (%)"
                        />
                        <span className="absolute right-3 text-xs font-bold text-slate-400 select-none">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Gateway Fee
                      </label>
                      <div className="flex items-center w-full h-10 border border-slate-200 rounded-md bg-white overflow-hidden focus-within:border-[#2D73B4] focus-within:ring-2 focus-within:ring-[#2D73B4]/15 transition-all shadow-2xs">
                        <input
                          type="number"
                          name="processingFee"
                          value={formData.processingFee}
                          onChange={handleInputChange}
                          className="w-full h-full px-3 text-xs font-semibold outline-none bg-transparent text-slate-800 min-w-0 placeholder:text-slate-400"
                          placeholder="Gateway Fee"
                        />
                        <div className="relative h-full border-l border-slate-200 flex items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                          <select
                            name="processingFeeType"
                            value={formData.processingFeeType || "Percentage"}
                            onChange={handleInputChange}
                            className="h-full pl-2.5 pr-6 text-xs bg-transparent font-bold outline-none text-slate-700 cursor-pointer appearance-none"
                          >
                            <option value="Fixed">₹</option>
                            <option value="Percentage">%</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tax Mode
                    </label>
                    <div className="relative">
                      <select
                        name="taxMode"
                        value={formData.taxMode}
                        onChange={handleInputChange}
                        className="w-full h-10 pl-3 pr-8 border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs bg-white font-medium text-slate-800 appearance-none cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="Exclusive">
                          Exclusive (Add GST % extra at checkout)
                        </option>
                        <option value="Inclusive">
                          Inclusive (GST included in price)
                        </option>
                        <option value="Free">Free / No Charge</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Section 4: Schedule, Timings & Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Total Hours & Duration
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center h-10 border border-slate-200 rounded-md bg-white overflow-hidden focus-within:border-[#2D73B4] focus-within:ring-2 focus-within:ring-[#2D73B4]/15 transition-all shadow-2xs">
                        <input
                          type="number"
                          min="1"
                          max="500"
                          name="totalHours"
                          value={formData.totalHours || ''}
                          onChange={handleInputChange}
                          className="w-full h-full px-2.5 text-center text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                          placeholder="Hours"
                        />
                        <span className="h-full border-l border-slate-200 flex items-center px-2.5 bg-slate-50 text-[11px] font-semibold text-slate-500 select-none shrink-0">
                          Hrs
                        </span>
                      </div>

                      <div className="flex items-center h-10 border border-slate-200 rounded-md bg-white overflow-hidden focus-within:border-[#2D73B4] focus-within:ring-2 focus-within:ring-[#2D73B4]/15 transition-all shadow-2xs">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          required
                          name="durationDays"
                          value={formData.durationDays}
                          onChange={handleInputChange}
                          className="w-full h-full px-2.5 text-center text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                          placeholder="Days"
                        />
                        <span className="h-full border-l border-slate-200 flex items-center px-2 bg-slate-50 text-[11px] font-semibold text-slate-500 select-none shrink-0">
                          -Day Workshop
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Workshop Timing
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center flex-1 h-10 border border-slate-200 rounded-md bg-white overflow-hidden focus-within:border-[#2D73B4] focus-within:ring-2 focus-within:ring-[#2D73B4]/15 transition-all shadow-2xs">
                        <input
                          type="text"
                          required
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="w-full h-full px-2.5 text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400 min-w-0"
                          placeholder="10:00"
                        />
                        <div className="relative h-full border-l border-slate-200 flex items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                          <select
                            name="startAmPm"
                            value={formData.startAmPm}
                            onChange={handleInputChange}
                            className="h-full pl-2 pr-5 text-xs bg-transparent font-bold outline-none text-slate-700 cursor-pointer appearance-none"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <span className="text-slate-400 font-semibold text-xs shrink-0">
                        to
                      </span>

                      <div className="flex items-center flex-1 h-10 border border-slate-200 rounded-md bg-white overflow-hidden focus-within:border-[#2D73B4] focus-within:ring-2 focus-within:ring-[#2D73B4]/15 transition-all shadow-2xs">
                        <input
                          type="text"
                          required
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="w-full h-full px-2.5 text-xs font-semibold outline-none bg-transparent text-slate-800 placeholder:text-slate-400 min-w-0"
                          placeholder="05:00"
                        />
                        <div className="relative h-full border-l border-slate-200 flex items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                          <select
                            name="endAmPm"
                            value={formData.endAmPm}
                            onChange={handleInputChange}
                            className="h-full pl-2 pr-5 text-xs bg-transparent font-bold outline-none text-slate-700 cursor-pointer appearance-none"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Start Date <span className="text-rose-500">*</span>
                    </label>
                    <DateInput
                      required
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 bg-white placeholder:text-slate-400 transition-all shadow-2xs"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      End Date (Optional)
                    </label>
                    <DateInput
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 bg-white placeholder:text-slate-400 transition-all shadow-2xs"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Schedule Status
                    </label>
                    <div className="relative">
                      <select
                        name="scheduleStatus"
                        value={formData.scheduleStatus || 'Scheduled'}
                        onChange={handleInputChange}
                        className="w-full h-10 pl-3 pr-8 border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 bg-white appearance-none cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Postponed">Postponed</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Seats Limit / Capacity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      name="seatCapacity"
                      value={formData.seatCapacity}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-semibold text-slate-800 placeholder:text-slate-400 transition-all shadow-2xs"
                      placeholder="Seats Limit"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Event Status
                    </label>
                    <div className="relative">
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full h-10 pl-3 pr-8 border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 bg-white appearance-none cursor-pointer transition-all shadow-2xs"
                      >
                        <option value="Registration Open">Registration Open</option>
                        <option value="Filling Fast">Filling Fast</option>
                        <option value="Registration Closed">Registration Closed</option>
                        <option value="Event Completed">Event Completed</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Section 5: Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Features (One per line)
                    </label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all resize shadow-2xs"
                      placeholder="Features (One per line)"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/80 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 text-xs font-semibold hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="programForm"
                className="px-5 py-2 bg-[#2D73B4] text-white text-xs font-bold rounded-md hover:bg-[#235b8f] transition-all shadow-xs cursor-pointer"
              >
                {editingId ? "Save Changes" : "Create Workshop"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📜 3. ENROLLED STUDENTS SIDE DRAWER / POPUP MODAL (For Past Workshops) */}
      {historyModalSummit && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setHistoryModalSummit(null);
              setHistorySearchQuery("");
            }}
          />

          {/* Side Drawer Panel */}
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 overflow-hidden border-l border-slate-200">
            {/* Drawer Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 via-slate-900 to-vmanous-navy-dark text-white flex items-center justify-between shadow-md shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-900">
                    Completed Workshop
                  </span>
                  <span className="text-xs text-emerald-300 font-semibold">
                    {historyModalSummit.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white">
                  {historyModalSummit.title}
                </h3>
                <p className="text-xs text-emerald-200/80 flex items-center gap-1.5 mt-0.5">
                  <Building2 size={13} className="text-emerald-400 shrink-0" />
                  <span>{historyModalSummit.college}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setHistoryModalSummit(null);
                  setHistorySearchQuery("");
                }}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Close Panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Action Bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              {/* Search Filter */}
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student, email, phone..."
                  value={historySearchQuery}
                  onChange={(e) => setHistorySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                />
              </div>

              {/* Download Excel Button */}
              {(() => {
                const attendees = getAttendeesForSummit(historyModalSummit);
                return (
                  <button
                    onClick={() => exportSummitAttendeesToExcel(historyModalSummit, attendees)}
                    disabled={attendees.length === 0}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    title="Download Excel Spreadsheet of Enrolled Students"
                  >
                    <Download size={15} />
                    <span>Export Excel File (.xls)</span>
                  </button>
                );
              })()}
            </div>

            {/* Enrolled Students List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(() => {
                const allAttendees = getAttendeesForSummit(historyModalSummit);
                const filteredAttendees = allAttendees.filter((app) => {
                  if (!historySearchQuery.trim()) return true;
                  const q = historySearchQuery.toLowerCase();
                  const name = (app.studentName || app.name || "").toLowerCase();
                  const email = (app.email || "").toLowerCase();
                  const phone = (app.phone || "").toLowerCase();
                  const passCode = (app.passCode || "").toLowerCase();
                  return name.includes(q) || email.includes(q) || phone.includes(q) || passCode.includes(q);
                });

                return (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Enrolled Students Registration List
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {filteredAttendees.length} of {allAttendees.length} Students
                      </span>
                    </div>

                    {filteredAttendees.length > 0 ? (
                      <div className="space-y-3">
                        {filteredAttendees.map((student, idx) => (
                          <div
                            key={student.id || idx}
                            className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center border border-emerald-200 shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-slate-900">
                                  {student.studentName || student.name || "Student"}
                                </div>
                                <div className="text-xs text-slate-500 font-medium">
                                  {student.email} • {student.phone}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 font-semibold">
                                  {student.degree || "B.Tech"} - {student.branch || "Computer Science"} ({student.year || "3rd Year"})
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:items-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-wider">
                                {student.paymentStatus || "Paid"}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {student.passCode || "PASS-VERIFIED"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                        <Users size={32} className="mx-auto text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">
                          No enrolled students found.
                        </p>
                        <p className="text-xs text-slate-400">
                          {historySearchQuery ? "Try adjusting your search query." : "No student submissions recorded for this past workshop."}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Subscription Modal UI */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-[400px] border-2 border-purple-500 p-8 flex flex-col items-center animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setIsRescheduleModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            {rescheduleStep === 'email' && editingId ? (
              <>
                <div className="w-full mb-5 mt-4">
                  <label className="block text-sm text-[#2e4c8f] font-semibold mb-1.5 ml-1">
                    Enter email to receive OTP
                  </label>
                  <input
                    type="email"
                    value={rescheduleEmail}
                    onChange={(e) => {
                      setRescheduleEmail(e.target.value);
                      if (rescheduleEmailError) setRescheduleEmailError('');
                    }}
                    disabled={isSendingOtp}
                    placeholder="am@vmanous.com"
                    className={`w-full h-11 px-3 border ${rescheduleEmailError ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-gray-300 focus:border-purple-400 focus:ring-purple-400'} rounded-md outline-none focus:ring-1 transition-colors shadow-sm text-center text-sm`}
                  />
                  {rescheduleEmailError && (
                    <p className="text-red-500 text-xs mt-1.5 text-center font-medium animate-in fade-in slide-in-from-top-1">{rescheduleEmailError}</p>
                  )}
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !rescheduleEmail}
                  className="w-full py-2.5 bg-[#dbe4ff] text-[#3b5998] font-bold text-sm rounded-full hover:bg-[#c7d6ff] transition-colors mb-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSendingOtp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#3b5998] border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div className="w-full mb-5 mt-4">
                  <label className="block text-sm text-[#2e4c8f] font-semibold mb-1.5 ml-1">
                    {isSendingOtp ? `Sending OTP to ${rescheduleEmail || 'am@vmanous.com'}...` : `Enter OTP sent to ${rescheduleEmail || 'am@vmanous.com'}`}
                  </label>
                  <input
                    type="text"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    disabled={isSendingOtp || isVerifyingOtp}
                    placeholder="6-digit OTP"
                    className="w-full h-11 px-3 border border-gray-300 rounded-md outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-colors shadow-sm text-center tracking-widest text-lg font-mono font-bold"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || isSendingOtp}
                  className="w-full py-2.5 bg-[#dbe4ff] text-[#3b5998] font-bold text-sm rounded-full hover:bg-[#c7d6ff] transition-colors mb-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isVerifyingOtp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#3b5998] border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : "Verify OTP"}
                </button>
              </>
            )}

            <p className="text-[10px] text-center text-[#5c729c] px-4 leading-relaxed">
              Your details are securely verified by Vmanous. Never share your OTP.<br />
              <a href="#" className="underline hover:text-[#2e4c8f]">Learn about our privacy policy</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePrograms;
