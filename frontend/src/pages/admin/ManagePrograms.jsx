import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, CheckCircle2, Building2, LayoutGrid, List, Receipt, DollarSign, History, Users, ChevronDown, Download, X, Search, Key, AlertCircle, Lock, ShieldCheck, Mail, Loader2 } from 'lucide-react';
import { getSummits, fetchSummitsAsync, addSummit, updateSummit, deleteSummit, formatEventDates, isSummitActive, isRegistrationUpcoming, isCollegeMatch, getAuthorizedAdminEmail, requestAuthorizedEmailChange, verifyAuthorizedEmailChange } from '../../services/summitService';
import { fetchApplicationsAsync } from '../../services/applicationService';
import { getAuthHeaders } from '../../services/adminAuthService';
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
  const [summits, setSummits] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [historyModalSummit, setHistoryModalSummit] = useState(null);
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [formError, setFormError] = useState("");

  const [authorizedAdminEmail, setAuthorizedAdminEmail] = useState('am@vmanous.com');
  const [isEmailChangeModalOpen, setIsEmailChangeModalOpen] = useState(false);
  const [emailChangeStep, setEmailChangeStep] = useState('input'); // 'input' | 'otp'
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailChangeOtpInput, setEmailChangeOtpInput] = useState('');
  const [isEmailChangeLoading, setIsEmailChangeLoading] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState('');
  const [emailChangeSuccessMsg, setEmailChangeSuccessMsg] = useState('');

  const [otpValue, setOtpValue] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [rescheduleEmail, setRescheduleEmail] = useState('');
  const [rescheduleStep, setRescheduleStep] = useState('email');
  const [rescheduleEmailError, setRescheduleEmailError] = useState('');
  const [rescheduleData, setRescheduleData] = useState({
    actionType: 'Rescheduled',
    date: '',
    startDate: '',
    endDate: ''
  });

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
      const [{ applications: apps }, data] = await Promise.all([
        fetchApplicationsAsync(),
        fetchSummitsAsync()
      ]);
      setApplications(apps || []);
      setSummits(data || []);
    } catch (err) {
      console.error("Error loading programs and applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const openHistoryStudentsModal = async (summit) => {
    try {
      const { applications: apps } = await fetchApplicationsAsync();
      setApplications(apps || []);
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

  const loadAuthorizedEmail = async () => {
    try {
      const email = await getAuthorizedAdminEmail();
      if (email) {
        setAuthorizedAdminEmail(email);
        setRescheduleEmail(email);
      }
    } catch (e) {
      console.error("Error loading authorized email:", e);
    }
  };

  useEffect(() => {
    loadSummits();
    loadAuthorizedEmail();
    window.addEventListener("summits_updated", loadSummits);
    window.addEventListener("applications_updated", loadSummits);

    let bc = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("vmanous_live_updates");
      bc.onmessage = (msg) => {
        if (msg.data?.type === "SUMMIT_UPDATED") {
          loadSummits();
          loadAuthorizedEmail();
        }
      };
    }

    return () => {
      window.removeEventListener("summits_updated", loadSummits);
      window.removeEventListener("applications_updated", loadSummits);
      if (bc) bc.close();
    };
  }, []);

  const openEmailChangeModal = () => {
    setEmailChangeStep('input');
    setNewEmailInput('');
    setEmailChangeOtpInput('');
    setEmailChangeError('');
    setEmailChangeSuccessMsg('');
    setIsEmailChangeModalOpen(true);
  };

  const handleRequestEmailChange = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setEmailChangeError('');
    setEmailChangeSuccessMsg('');

    if (!newEmailInput || !newEmailInput.trim()) {
      setEmailChangeError('Please enter a valid email address.');
      return;
    }

    const emailToSubmit = newEmailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToSubmit)) {
      setEmailChangeError('Please enter a valid email address format.');
      return;
    }

    if (emailToSubmit === (authorizedAdminEmail || 'am@vmanous.com').toLowerCase()) {
      setEmailChangeError('This email is already the active authorized webmail.');
      return;
    }

    setIsEmailChangeLoading(true);
    try {
      const res = await requestAuthorizedEmailChange(emailToSubmit);
      if (res.success) {
        setEmailChangeStep('otp');
        setEmailChangeSuccessMsg(res.message || `Security OTP sent to current owner (${res.currentEmail || authorizedAdminEmail})`);
      } else {
        setEmailChangeError(res.error || 'Failed to request email change.');
      }
    } catch (err) {
      setEmailChangeError('Server error processing security request.');
    } finally {
      setIsEmailChangeLoading(false);
    }
  };

  const handleVerifyEmailChange = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setEmailChangeError('');

    if (!emailChangeOtpInput || emailChangeOtpInput.trim().length !== 6) {
      setEmailChangeError('Please enter the 6-digit confirmation OTP sent to current owner.');
      return;
    }

    setIsEmailChangeLoading(true);
    try {
      const res = await verifyAuthorizedEmailChange(emailChangeOtpInput.trim(), newEmailInput.trim().toLowerCase());
      if (res.success) {
        const updated = res.authorizedEmail || newEmailInput.trim().toLowerCase();
        setAuthorizedAdminEmail(updated);
        setRescheduleEmail(updated);
        setIsEmailChangeModalOpen(false);
        setEmailChangeStep('input');
        setNewEmailInput('');
        setEmailChangeOtpInput('');
        alert(`✅ Success: Authorized Webmail successfully transferred to ${updated}! All future OTPs and schedule authorizations will go to this email.`);
      } else {
        setEmailChangeError(res.error || 'Invalid OTP or verification failed.');
      }
    } catch (err) {
      setEmailChangeError('Server error verifying security code.');
    } finally {
      setIsEmailChangeLoading(false);
    }
  };

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      await deleteSummit(id);
      await loadSummits();
    }
  };

  const handleInputChange = async (e) => {
    setFormError("");
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // If selecting Preponed/Rescheduled/Postponed and editing an existing summit
    if (name === "scheduleStatus" && ["Preponed", "Rescheduled", "Postponed"].includes(value) && editingId) {
      setRescheduleData({
        actionType: value,
        date: formData.date || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || ''
      });
      setRescheduleStep('email');
      setRescheduleEmail(authorizedAdminEmail || 'am@vmanous.com');
      setRescheduleEmailError('');
      setOtpValue('');
      setIsRescheduleModalOpen(true);
    } else if (name === "scheduleStatus" && ["Preponed", "Rescheduled", "Postponed"].includes(value)) {
      // If creating a new summit, just open modal but don't send API (no editingId)
      setRescheduleData({
        actionType: value,
        date: formData.date || '',
        startDate: formData.startDate || '',
        endDate: formData.endDate || ''
      });
      setIsRescheduleModalOpen(true);
    }
  };

  const handleSendOtp = async () => {
    setRescheduleEmailError('');
    const currentActiveEmail = authorizedAdminEmail || 'am@vmanous.com';
    const targetEmail = (rescheduleEmail || currentActiveEmail).trim();
    if (!targetEmail) {
      setRescheduleEmailError("Please enter an email address.");
      return;
    }

    if (targetEmail.toLowerCase() !== currentActiveEmail.toLowerCase()) {
      setRescheduleEmailError(`Invalid email address. Please use the authorized webmail (${currentActiveEmail}).`);
      return;
    }    // Validate proposed dates
    if (!rescheduleData.date) {
      setRescheduleEmailError("Please provide a new Summit Date for this schedule update.");
      return;
    }

    setIsSendingOtp(true);

    // Calculate derived data for API
    const days = parseInt(formData.durationDays) || 1;
    const duration = `${days}-Day Live Workshop`;
    const timeStr = `${formData.startTime || "10:00"} ${formData.startAmPm || "AM"} - ${formData.endTime || "05:00"} ${formData.endAmPm || "PM"}`;
    const formattedDate = rescheduleData.date || formData.date;

    const summitData = {
      ...formData,
      scheduleStatus: rescheduleData.actionType,
      status: rescheduleData.actionType, // Update main status too
      totalHours: formData.totalHours ? String(formData.totalHours).trim() : "",
      duration: duration,
      time: timeStr,
      date: formattedDate,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      const res = await fetch('/api/v1/summits/send-reschedule-otp', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ summitId: editingId, newData: summitData, email: targetEmail })
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
      // If it's a new workshop, update local date and close
      const formattedDate = rescheduleData.date || formData.date;

      setFormData(prev => ({
        ...prev,
        scheduleStatus: rescheduleData.actionType,
        status: rescheduleData.actionType,
        date: formattedDate
      }));
      setIsRescheduleModalOpen(false);
      return;
    }

    if (!otpValue || otpValue.trim() === '') {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await fetch('/api/v1/summits/verify-reschedule-otp', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          summitId: editingId,
          otp: otpValue.trim(),
          message: `Workshop schedule has been updated to ${rescheduleData.actionType || 'Rescheduled'}.`
        })
      });
      const data = await res.json();

      if (data.success) {
        const formattedDate = rescheduleData.date || formData.date;

        setFormData(prev => ({
          ...prev,
          scheduleStatus: rescheduleData.actionType,
          status: rescheduleData.actionType,
          date: formattedDate
        }));

        alert(data.message || `Workshop marked as ${rescheduleData.actionType || 'Rescheduled'} and new date applied successfully!`);
        setIsRescheduleModalOpen(false);
        setOtpValue('');
        await loadSummits();
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
    const formattedDate = formData.date
      ? formData.date
      : (formData.startDate || formData.endDate
        ? formatEventDates(formData.startDate, finalEndDate)
        : "");

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

    await loadSummits();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 bg-white min-h-full">
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
            className="flex items-center gap-2 px-4 py-2 bg-transparent text-emerald-700 rounded-lg border border-emerald-600 hover:border-emerald-700 hover:bg-emerald-50/50 hover:font-bold transition-all shadow-2xs font-semibold cursor-pointer active:scale-[0.99]"
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
            {isLoading && (
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            )}
            {!isLoading && summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').map((summit, index) => (
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
            {!isLoading && summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').length === 0 && (
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
                  {isLoading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        </div>
                      </td>
                    </tr>
                  )}
                  {!isLoading && summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').map((summit) => (
                    <tr key={summit.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-vmanous-navy-dark">{summit.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{summit.subtitle}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md">
                            {summit.type}
                          </span>
                          {isRegistrationUpcoming(summit) && (
                            <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold uppercase rounded-md border border-purple-300">
                              Scheduled (Starts Soon)
                            </span>
                          )}
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
                  {!isLoading && summits.filter(s => isSummitActive(s) && s.status !== 'Event Completed' && s.status !== 'Completed').length === 0 && (
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
            {isLoading && (
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
            )}
            {!isLoading && summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').map((summit, index) => (
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
            {!isLoading && summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').length === 0 && (
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
                  {isLoading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                        </div>
                      </td>
                    </tr>
                  )}
                  {!isLoading && summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').map((summit) => (
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
                  {!isLoading && summits.filter(s => !isSummitActive(s) || s.status === 'Event Completed' || s.status === 'Completed').length === 0 && (
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
          <div className="bg-white rounded-md shadow-2xl w-full max-w-3xl my-8 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
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
                <div className="bg-white p-4 rounded-md border border-slate-200 space-y-3.5 shadow-2xs">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Summit Date
                      </label>
                      {editingId && (
                        <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                          <Lock size={10} className="text-amber-600" /> Locked
                        </span>
                      )}
                    </div>
                    <DateInput
                      name="date"
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      disabled={!!editingId}
                      className={`w-full h-10 px-3 border rounded-md outline-none text-xs font-medium transition-all shadow-2xs ${editingId
                        ? 'border-slate-200 bg-slate-100/90 text-slate-500 cursor-not-allowed select-none'
                        : 'border-slate-200 bg-white focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 text-slate-800'
                        }`}
                      placeholder="DD/MM/YYYY"
                    />
                    {editingId && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Locked during edit. Change <strong>Schedule Status</strong> (Preponed/Rescheduled/Postponed) below to update dates.
                      </p>
                    )}
                  </div>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <option value="Preponed">Preponed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Postponed">Postponed</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
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
                <div className="w-full">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Features (One per line)
                  </label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full max-w-full min-w-[160px] p-3 border border-slate-200 rounded-md focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-colors resize shadow-2xs box-border"
                    placeholder="Features (One per line)"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 flex justify-end gap-3 bg-white shrink-0">
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
                className="px-5 py-2 bg-transparent text-emerald-700 text-xs font-semibold rounded-md border border-emerald-600 hover:border-emerald-700 hover:bg-emerald-50/50 hover:font-bold transition-all shadow-2xs cursor-pointer active:scale-[0.99]"
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
                  return (
                    (app.studentName && app.studentName.toLowerCase().includes(q)) ||
                    (app.name && app.name.toLowerCase().includes(q)) ||
                    (app.email && app.email.toLowerCase().includes(q)) ||
                    (app.phone && app.phone.includes(q)) ||
                    (app.passCode && app.passCode.toLowerCase().includes(q))
                  );
                });

                return (
                  <>
                    {/* Search & Export Toolbar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                          type="text"
                          placeholder="Search student by name, email, phone, passcode..."
                          value={historySearchQuery}
                          onChange={(e) => setHistorySearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D73B4]/15 focus:border-[#2D73B4] font-medium"
                        />
                      </div>
                      <button
                        onClick={() => exportAttendeesToExcel(filteredAttendees, `${(historyModalSummit.title || 'Summit').replace(/\s+/g, '_')}_Attendees`)}
                        disabled={filteredAttendees.length === 0}
                        className="px-3.5 py-1.5 bg-[#2D73B4] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-2xs flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        <Download size={13} />
                        <span>Export Excel</span>
                      </button>
                    </div>

                    {/* Stats Header */}
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

      {/* Reschedule / Security OTP Modal UI */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[390px] border border-slate-200 p-5 flex flex-col animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setIsRescheduleModalOpen(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              style={{ right: '16px', top: '16px' }}
            >
              <X size={18} />
            </button>

            {/* Modal Title & Action Badge */}
            <div className="text-center mb-4">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 border border-emerald-200 shadow-2xs">
                <ShieldCheck size={24} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-[#2D73B4] border border-blue-200 mb-1">
                <span>Action: {rescheduleData.actionType || 'Rescheduled'}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Authorize Schedule & Date Update
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {formData.title || 'AI Summit Workshop'}
              </p>
            </div>

            {rescheduleStep === 'email' ? (
              <div className="space-y-3.5">
                {/* Date Input in Reschedule Modal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Summit Date <span className="text-rose-500">*</span>
                  </label>
                  <DateInput
                    name="rescheduleSummitDate"
                    value={rescheduleData.date || ''}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none text-xs font-medium text-slate-800 bg-white placeholder:text-slate-400 shadow-2xs"
                    placeholder="DD/MM/YYYY"
                  />
                </div>

                {/* Email Verification Box */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Authorized Mail
                    </label>
                    <button
                      type="button"
                      onClick={openEmailChangeModal}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors shadow-2xs"
                      title="Transfer / Change Authorized Webmail with 2-Factor Authentication"
                    >
                      <Lock size={10} className="text-emerald-600" />
                      <span>Change 🔒</span>
                    </button>
                  </div>
                  <input
                    type="email"
                    value={rescheduleEmail || authorizedAdminEmail || 'am@vmanous.com'}
                    onChange={(e) => {
                      setRescheduleEmail(e.target.value);
                      if (rescheduleEmailError) setRescheduleEmailError('');
                    }}
                    disabled={true}
                    placeholder="am@vmanous.com"
                    className={`w-full h-10 px-3 border border-slate-200 rounded-lg outline-none transition-colors text-center text-xs font-semibold text-slate-700 bg-slate-50/80 shadow-2xs cursor-not-allowed`}
                  />
                  {rescheduleEmailError && (
                    <p className="text-red-500 text-[11px] mt-1 text-center font-medium">{rescheduleEmailError}</p>
                  )}
                </div>

                <div className="flex justify-center pt-1">
                  <button
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || !rescheduleEmail}
                    className="w-full sm:w-auto px-6 h-[38px] bg-white text-emerald-700 font-bold text-xs rounded-lg border-2 border-emerald-600/80 hover:border-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-xs"
                  >
                    {isSendingOtp ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </>
                    ) : 'Send OTP'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-center shadow-2xs">
                  <p className="text-xs text-[#2D73B4] font-semibold">
                    Proposed New Date: {rescheduleData.date || rescheduleData.startDate || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    6-digit code has been sent to <strong>{rescheduleEmail || authorizedAdminEmail || 'am@vmanous.com'}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    disabled={isVerifyingOtp}
                    placeholder="• • • • • •"
                    className="w-full h-11 px-3 border border-slate-300 rounded-lg outline-none focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 transition-colors shadow-2xs text-center tracking-widest text-lg font-mono font-normal text-slate-800 bg-white"
                    maxLength={6}
                  />
                </div>

                <div className="flex justify-center pt-1">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || !otpValue}
                    className="w-full sm:w-auto px-6 h-[38px] bg-white text-emerald-700 font-semibold hover:font-extrabold text-xs rounded-lg border-2 border-emerald-600/80 hover:border-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-xs"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying OTP & Updating...</span>
                      </>
                    ) : `Verify OTP & Apply ${rescheduleData.actionType || 'Schedule Update'}`}
                  </button>
                </div>
              </div>
            )}

            <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">
              Protected by VMANOUS Security Gateway. Never share your OTP.
            </p>
          </div>
        </div>
      )}

      {/* 🔐 Dual-Factor Authorized Webmail Transfer Modal */}
      {isEmailChangeModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[420px] border border-slate-200 py-7 px-6 sm:px-7.5 flex flex-col justify-between animate-in zoom-in-95 duration-200 relative min-h-[460px]">
            <button
              onClick={() => setIsEmailChangeModalOpen(false)}
              className="absolute top-4.5 right-4.5 z-20 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              style={{ right: '18px', top: '18px' }}
              title="Close Modal"
            >
              <X size={18} />
            </button>

            {/* Header Icon & Title */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-emerald-200 shadow-2xs">
                <ShieldCheck size={26} />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs mb-1.5">
                <span>Security Gateway • Dual Auth</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                Change Authorized Webmail
              </h4>
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200/90 text-xs">
                <span className="text-slate-500 font-medium">Current:</span>
                <span className="text-slate-800 font-bold">{authorizedAdminEmail || 'am@vmanous.com'}</span>
              </div>
            </div>

            {emailChangeError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium flex items-center gap-2 shadow-2xs">
                <AlertCircle size={15} className="shrink-0 text-red-500" />
                <span>{emailChangeError}</span>
              </div>
            )}

            {emailChangeSuccessMsg && emailChangeStep === 'otp' && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium text-center shadow-2xs">
                {emailChangeSuccessMsg}
              </div>
            )}

            {emailChangeStep === 'input' ? (
              <form onSubmit={handleRequestEmailChange} className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    New Authorized Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={newEmailInput}
                      onChange={(e) => {
                        setNewEmailInput(e.target.value);
                        if (emailChangeError) setEmailChangeError('');
                      }}
                      placeholder="e.g. admin@vmanous.com or user@gmail.com"
                      required
                      className="w-full h-12 pl-10 pr-3.5 border border-slate-200 rounded-md focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 outline-none text-xs font-medium text-slate-800 bg-white placeholder:text-slate-400 placeholder:font-normal transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-lg text-[11px] text-slate-600 leading-relaxed flex items-start gap-2 shadow-2xs">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold">Anti-Hijack Verification:</strong> A 6-digit confirmation code will be dispatched to current owner (<strong className="text-emerald-700">{authorizedAdminEmail || 'am@vmanous.com'}</strong>) to authorize this transfer.
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEmailChangeModalOpen(false)}
                    className="px-5 h-[38px] text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEmailChangeLoading || !newEmailInput}
                    className="px-5 h-[38px] bg-transparent text-emerald-700 rounded-lg border border-emerald-600 hover:border-emerald-700 hover:bg-emerald-50/60 hover:font-bold transition-all shadow-2xs font-semibold text-xs cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isEmailChangeLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : 'Send Authorization OTP'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailChange} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-2xs">
                    <p className="text-xs text-slate-700 font-semibold">
                      Transferring Authorization To: <strong className="text-emerald-700">{newEmailInput}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Enter the 6-digit code sent to current owner <strong>{authorizedAdminEmail}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                      Enter 6-Digit Security OTP
                    </label>
                    <input
                      type="text"
                      value={emailChangeOtpInput}
                      onChange={(e) => setEmailChangeOtpInput(e.target.value)}
                      disabled={isEmailChangeLoading}
                      placeholder="• • • • • •"
                      maxLength={6}
                      required
                      className="w-full h-12 px-3 border border-slate-300 rounded-md outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 transition-colors shadow-2xs text-center tracking-widest text-lg font-mono font-normal text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEmailChangeStep('input')}
                    className="px-4 h-[38px] text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isEmailChangeLoading || !emailChangeOtpInput}
                    className="px-5 h-[38px] bg-transparent text-emerald-700 rounded-lg border border-emerald-600 hover:border-emerald-700 hover:bg-emerald-50/60 hover:font-bold transition-all shadow-2xs font-semibold text-xs cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isEmailChangeLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Verifying OTP...</span>
                      </>
                    ) : 'Verify & Transfer Webmail'}
                  </button>
                </div>
              </form>
            )}

            <p className="text-[10px] text-center text-slate-400 mt-4">
              Protected by VMANOUS Security Gateway. Never share your OTP.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePrograms;
