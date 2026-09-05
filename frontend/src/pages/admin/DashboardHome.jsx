import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  FileText,
  AlertCircle,
  CheckCircle2,
  IndianRupee,
  Receipt,
  Download,
  TrendingUp,
  PieChart as PieChartIcon,
  CreditCard,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Eye,
  Building2,
  MapPin,
  Mail,
  Phone,
  Clock,
  X,
  ChevronDown,
  Loader2,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import { getSummits, fetchSummitsAsync, isSummitActive, isCollegeMatch } from "../../services/summitService";
import {
  fetchApplicationsAsync,
  getFinancialMetrics,
  exportGSTFinancialReportToCSV,
  updateVerificationStatus,
  deleteApplication,
} from "../../services/applicationService";
import { getUniqueStudents } from "../../services/studentService";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [summits, setSummits] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Master Date Filter State (Controls Revenue Cards, KPI Stat Cards & Applications Table)
  const [revenueDateRange, setRevenueDateRange] = useState("all"); // all, 7d, 1m, 3m, 6m, ytd, custom
  const [revStart, setRevStart] = useState("");
  const [revEnd, setRevEnd] = useState("");

  // Table Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("All");
  const [activeTab, setActiveTab] = useState("All"); // All, Paid, Failed, Pending Audit
  const [selectedApp, setSelectedApp] = useState(null); // Inspect Modal

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCollegeOpen, setIsCollegeOpen] = useState(false);

  const statusDropdownRef = useRef(null);
  const collegeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setIsStatusOpen(false);
      }
      if (
        collegeDropdownRef.current &&
        !collegeDropdownRef.current.contains(event.target)
      ) {
        setIsCollegeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [{ applications: serverApps }, summitsList, stuRes] = await Promise.all([
        fetchApplicationsAsync(),
        fetchSummitsAsync(),
        fetch(`/api/v1/students?_t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          }
        }).then(r => r.ok ? r.json() : { success: false, data: [] }).catch(() => ({ success: false, data: [] }))
      ]);

      const apiStudents = (stuRes && stuRes.success && Array.isArray(stuRes.data)) ? stuRes.data : [];
      const uniqueList = getUniqueStudents(serverApps, apiStudents);

      setApplications(serverApps || []);
      setSummits(summitsList || []);
      setStudents(uniqueList || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener("summits_updated", loadDashboardData);
    window.addEventListener("applications_updated", loadDashboardData);

    let bc = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("vmanous_live_updates");
      bc.onmessage = (msg) => {
        if (msg.data?.type === "SUMMIT_UPDATED") {
          loadDashboardData();
        }
      };
    }

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        loadDashboardData();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("summits_updated", loadDashboardData);
      window.removeEventListener("applications_updated", loadDashboardData);
      window.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      if (bc) bc.close();
    };
  }, []);

  // 1. MASTER DATE FILTERING LOGIC (Applies across all revenue cards, stats, and table)
  const dateFilteredApps = applications.filter((app) => {
    if (revenueDateRange === "all") return true;
    if (!app.createdAt) return true;
    const d = new Date(app.createdAt);
    const now = new Date();

    if (revenueDateRange === "7d") {
      const cut = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= cut;
    }
    if (revenueDateRange === "1m") {
      const cut = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return d >= cut;
    }
    if (revenueDateRange === "3m") {
      const cut = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return d >= cut;
    }
    if (revenueDateRange === "6m") {
      const cut = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      return d >= cut;
    }
    if (revenueDateRange === "ytd") {
      const cut = new Date(now.getFullYear(), 0, 1);
      return d >= cut;
    }
    if (revenueDateRange === "custom") {
      if (revStart) {
        const s = new Date(revStart);
        s.setHours(0, 0, 0, 0);
        if (d < s) return false;
      }
      if (revEnd) {
        const e = new Date(revEnd);
        e.setHours(23, 59, 59, 999);
        if (d > e) return false;
      }
      return true;
    }
    return true;
  });

  const activeSummits = summits.filter(isSummitActive);

  // Active Paid Applications (42 active enrollments matching active workshops)
  const activePaidApps = dateFilteredApps.filter((app) => {
    if (app.paymentStatus && app.paymentStatus !== "Paid") return false;
    if (activeSummits.length === 0) return true;
    return activeSummits.some((s) => {
      const sumTitle = (s.title || "").trim().toLowerCase();
      const collegeMatches = isCollegeMatch(app.collegeName, s.college);

      if (app.summitId && (app.summitId === s.id || Number(app.summitId) === Number(s.id))) {
        if (!s.college || collegeMatches) return true;
      }

      const progTitle = (app.programTitle || "").trim().toLowerCase();
      const titleMatches = Boolean(
        progTitle &&
        sumTitle &&
        (progTitle === sumTitle ||
          progTitle.includes(sumTitle) ||
          sumTitle.includes(progTitle))
      );

      return titleMatches && collegeMatches;
    });
  });

  // Calculate dynamic financial metrics for Active Paid Enrollments (dynamic per workshop)
  const revMetrics = getFinancialMetrics(
    activePaidApps.length > 0 ? activePaidApps : dateFilteredApps,
    summits,
  );

  // 2. TABLE FILTERING LOGIC (Filters dateFilteredApps further by College, Status, Search)
  const filteredApps = dateFilteredApps.filter((app) => {
    // Only display applications matching active workshops when activeTab is All or Paid by default
    if ((activeTab === "All" || activeTab === "Paid") && activeSummits.length > 0) {
      if (app.paymentStatus && app.paymentStatus !== "Paid") return false;
      const isMatchingActive = activeSummits.some((s) => {
        const sumTitle = (s.title || "").trim().toLowerCase();
        const collegeMatches = isCollegeMatch(app.collegeName, s.college);

        if (
          app.summitId &&
          (app.summitId === s.id || Number(app.summitId) === Number(s.id))
        ) {
          if (!s.college || collegeMatches) return true;
        }

        const progTitle = (app.programTitle || "").trim().toLowerCase();
        const titleMatches = Boolean(
          progTitle &&
          sumTitle &&
          (progTitle === sumTitle ||
            progTitle.includes(sumTitle) ||
            sumTitle.includes(progTitle)),
        );

        return titleMatches && collegeMatches;
      });

      if (!isMatchingActive) return false;
    }

    // College Filter
    if (selectedCollege !== "All") {
      const target = selectedCollege.toLowerCase();
      const appCol = (app.collegeName || "").toLowerCase();
      if (!appCol.includes(target) && !target.includes(appCol)) {
        return false;
      }
    }

    // Status Tab Filter
    if (activeTab === "Paid" && app.paymentStatus !== "Paid") return false;
    if (activeTab === "Failed" && app.paymentStatus !== "Failed") return false;
    if (
      activeTab === "Pending Audit" &&
      app.verificationStatus !== "Pending Audit"
    )
      return false;

    // Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = app.studentName?.toLowerCase().includes(q);
      const matchEmail = app.email?.toLowerCase().includes(q);
      const matchCollege = app.collegeName?.toLowerCase().includes(q);
      const matchTxn = app.transactionId?.toLowerCase().includes(q);
      return matchName || matchEmail || matchCollege || matchTxn;
    }
    return true;
  });

  // Update verification status
  const handleStatusChange = async (id, newStatus) => {
    await updateVerificationStatus(id, newStatus);
    await loadDashboardData();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp((prev) => prev ? { ...prev, verificationStatus: newStatus } : null);
    }
  };

  // Delete record
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this application record?")
    ) {
      await deleteApplication(id);
      await loadDashboardData();
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
      }
    }
  };

  // Contextual Dynamic Styling for Status Dropdown
  const getStatusStyles = (tab) => {
    switch (tab) {
      case "Paid":
        return {
          bg: "bg-emerald-50 border-emerald-300 text-emerald-800 focus:ring-emerald-500/20 focus:border-emerald-500",
          iconColor: "text-emerald-600",
          IconComponent: CheckCircle2,
        };
      case "Failed":
        return {
          bg: "bg-rose-50 border-rose-300 text-rose-800 focus:ring-rose-500/20 focus:border-rose-500",
          iconColor: "text-rose-600",
          IconComponent: AlertCircle,
        };
      case "Pending Audit":
        return {
          bg: "bg-amber-50 border-amber-300 text-amber-900 focus:ring-amber-500/20 focus:border-amber-500",
          iconColor: "text-amber-600",
          IconComponent: Clock,
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-200 text-slate-800 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4]",
          iconColor: "text-[#2D73B4]",
          IconComponent: Filter,
        };
    }
  };

  const currentStatusStyle = getStatusStyles(activeTab);
  const StatusIcon = currentStatusStyle.IconComponent;

  const paidCount = dateFilteredApps.filter(
    (a) => a.paymentStatus === "Paid",
  ).length;
  const failedCount = dateFilteredApps.filter(
    (a) => a.paymentStatus === "Failed",
  ).length;
  const pendingAuditCount = dateFilteredApps.filter(
    (a) => a.verificationStatus === "Pending Audit",
  ).length;

  // Dynamic Colleges List: Auto-expands whenever a new College/Workshop is added (5 -> 6 -> 7...)
  const allCollegeNames = Array.from(
    new Set(
      [
        ...summits.map((s) => s.college),
        ...applications.map((a) => a.collegeName),
      ].filter(Boolean),
    ),
  ).sort();

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* 🟢 MASTER FINANCIAL & REVENUE HEADER BAR WITH UNIFIED DATE RANGE FILTER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 py-1 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
            <IndianRupee size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Revenue & Tax Analytics Summary
            </h2>
            <p className="text-[11px] text-slate-500">
              Real-time collection, base value, GST liability, and platform
              processing fee tracker
            </p>
          </div>
        </div>

        {/* Master Controls: Master Date Range Filter & CSV Export */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Revenue & Page Master Duration Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-md border border-gray-200">
            <CalendarIcon size={13} className="text-gray-500 ml-1" />
            <select
              value={revenueDateRange}
              onChange={(e) => setRevenueDateRange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 py-0.5 pr-1 outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="1m">1 Month (30 Days)</option>
              <option value="3m">3 Months (90 Days)</option>
              <option value="6m">6 Months (180 Days)</option>
              <option value="ytd">This Year (YTD)</option>
              <option value="custom">Custom Date Range...</option>
            </select>
          </div>

          {/* Custom Date Inputs in DD/MM/YYYY Format */}
          {revenueDateRange === "custom" && (
            <div className="flex items-center gap-1.5 animate-in fade-in">
              <div className="relative inline-flex items-center">
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  readOnly
                  value={
                    revStart
                      ? `${revStart.split("-")[2]}/${revStart.split("-")[1]}/${revStart.split("-")[0]}`
                      : ""
                  }
                  onClick={(e) => {
                    const hidden =
                      e.currentTarget.parentElement.querySelector(
                        'input[type="date"]',
                      );
                    if (hidden && hidden.showPicker) hidden.showPicker();
                  }}
                  className="w-26 px-2 py-1 text-xs font-semibold text-slate-700 bg-white border border-gray-300 rounded-md outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
                />
                <input
                  type="date"
                  value={revStart}
                  onChange={(e) => setRevStart(e.target.value)}
                  className="absolute opacity-0 pointer-events-none w-0 h-0"
                />
              </div>

              <span className="text-xs font-medium text-gray-400">to</span>

              <div className="relative inline-flex items-center">
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  readOnly
                  value={
                    revEnd
                      ? `${revEnd.split("-")[2]}/${revEnd.split("-")[1]}/${revEnd.split("-")[0]}`
                      : ""
                  }
                  onClick={(e) => {
                    const hidden =
                      e.currentTarget.parentElement.querySelector(
                        'input[type="date"]',
                      );
                    if (hidden && hidden.showPicker) hidden.showPicker();
                  }}
                  className="w-26 px-2 py-1 text-xs font-semibold text-slate-700 bg-white border border-gray-300 rounded-md outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
                />
                <input
                  type="date"
                  value={revEnd}
                  onChange={(e) => setRevEnd(e.target.value)}
                  className="absolute opacity-0 pointer-events-none w-0 h-0"
                />
              </div>
            </div>
          )}

          {/* Export Report Button */}
          <button
            onClick={() => exportGSTFinancialReportToCSV(dateFilteredApps, summits)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-all shadow-xs cursor-pointer"
          >
            <Download size={13} />
            Export GST Report (CSV)
          </button>
        </div>
      </div>

      {/* 4 Key Financial Metrics (Calculated dynamically per workshop for selected Master Date Range) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Gross Revenue */}
        <div className="bg-white p-3 rounded-lg border border-gray-200/90 shadow-2xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-bold text-slate-500">
              Total Gross Revenue
            </span>
            <span className="p-1 bg-emerald-50 text-emerald-600 rounded-md">
              <TrendingUp size={15} />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight h-8 flex items-center">
            {isLoading ? <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" /> : `₹${revMetrics.grossRevenue.toLocaleString("en-IN")}`}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium">
              {revMetrics.totalPaidCount} Paid Registrations
            </span>
            <span className="text-emerald-600 font-bold uppercase">
              {revenueDateRange === "all" ? "All Time" : revenueDateRange}
            </span>
          </div>
        </div>

        {/* Card 2: Base Revenue */}
        <div className="bg-white p-3 rounded-lg border border-gray-200/90 shadow-2xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-bold text-slate-500">
              Base Net Value (Excl. Tax)
            </span>
            <span className="p-1 bg-sky-50 text-sky-600 rounded-md">
              <PieChartIcon size={15} />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight h-8 flex items-center">
            {isLoading ? <Loader2 className="w-5 h-5 text-sky-600 animate-spin" /> : `₹${revMetrics.baseRevenue.toLocaleString("en-IN")}`}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Course sales before tax
          </div>
        </div>

        {/* Card 3: GST Liability (Dynamic per workshop tax rate) */}
        <div className="bg-white p-3 rounded-lg border border-gray-200/90 shadow-2xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-bold text-slate-500">
              GST Collected
            </span>
            <span className="p-1 bg-amber-50 text-amber-600 rounded-md">
              <Receipt size={15} />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight h-8 flex items-center">
            {isLoading ? <Loader2 className="w-5 h-5 text-amber-600 animate-spin" /> : `₹${revMetrics.gstCollected.toLocaleString("en-IN")}`}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Accrued GST tax liability
          </div>
        </div>

        {/* Card 4: Platform Fee (Dynamic per workshop processing fee) */}
        <div className="bg-white p-3 rounded-lg border border-gray-200/90 shadow-2xs">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-bold text-slate-500">
              Platform Fee
            </span>
            <span className="p-1 bg-indigo-50 text-indigo-600 rounded-md">
              <CreditCard size={15} />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight h-8 flex items-center">
            {isLoading ? <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /> : `₹${revMetrics.platformFeeCollected.toLocaleString("en-IN")}`}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            Convenience & processing fee
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (Dynamically updated for selected Master Date Range) */}
      {(() => {
        const totalAllEnrolled = summits.reduce(
          (sum, s) => sum + Number(s.enrolledCount || 0),
          0
        );
        const displayTotalStudents = filteredApps.length > 0 ? filteredApps.length : (totalAllEnrolled > 0 ? totalAllEnrolled : students.length);

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <StatCard
              title="Total Students"
              value={displayTotalStudents.toString()}
              icon={Users}
              onClick={() => navigate('/vpanel/applications')}
              isLoading={isLoading}
            />
            <StatCard
              title="Active Programs"
              value={summits.length.toString()}
              icon={BookOpen}
              onClick={() => navigate('/vpanel/ai-summits')}
              isLoading={isLoading}
            />
            <StatCard
              title="Paid Registrations"
              value={revMetrics.totalPaidCount.toString()}
              icon={CheckCircle2}
              onClick={() => navigate('/vpanel/applications')}
              isLoading={isLoading}
            />
            <StatCard
              title="Failed Payments"
              value={revMetrics.failedCount.toString()}
              icon={AlertCircle}
              onClick={() => navigate('/vpanel/applications')}
              isLoading={isLoading}
            />
            <StatCard
              title="Pending Audits"
              value={revMetrics.pendingAuditCount.toString()}
              icon={FileText}
              onClick={() => navigate('/vpanel/applications')}
              isLoading={isLoading}
            />
          </div>
        );
      })()}

      {/* 📋 COMPLETE STUDENT APPLICATIONS & LEADS TABLE */}
      <div className="space-y-3 pt-1">
        {/* Table Title & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Student Applications & Leads
            </h2>
            <p className="text-slate-500 text-xs">
              Showing student submissions for selected period (
              {filteredApps.length} records)
            </p>
          </div>
        </div>

        {/* Filter Bar & Dropdowns */}
        <div className="bg-white p-3 rounded-lg border border-gray-200/90 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            {/* Status Filter Custom Floating Dropdown */}
            <div className="relative w-full" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`relative w-full pl-9 pr-8 py-2 border rounded-lg text-xs font-extrabold outline-none cursor-pointer transition-all text-left ${currentStatusStyle.bg}`}
              >
                <StatusIcon
                  size={16}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentStatusStyle.iconColor}`}
                />
                <span className="block truncate pr-2">
                  {activeTab === "All" &&
                    `All Statuses (${filteredApps.length})`}
                  {activeTab === "Paid" && `Paid Registrations (${paidCount})`}
                  {activeTab === "Failed" && `Failed Payments (${failedCount})`}
                  {activeTab === "Pending Audit" &&
                    `Pending Audit (${pendingAuditCount})`}
                </span>
                <ChevronDown
                  size={14}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isStatusOpen && (
                <div className="absolute left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("All");
                      setIsStatusOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${activeTab === "All"
                      ? "bg-slate-100 text-slate-900 font-extrabold"
                      : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    <Filter size={14} className="text-[#2D73B4]" />
                    <span>All Statuses ({filteredApps.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Paid");
                      setIsStatusOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${activeTab === "Paid"
                      ? "bg-emerald-100 text-emerald-900 font-extrabold"
                      : "text-emerald-800 hover:bg-emerald-50"
                      }`}
                  >
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Paid Registrations ({paidCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Failed");
                      setIsStatusOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${activeTab === "Failed"
                      ? "bg-rose-100 text-rose-900 font-extrabold"
                      : "text-rose-800 hover:bg-rose-50"
                      }`}
                  >
                    <AlertCircle size={14} className="text-rose-600" />
                    <span>Failed Payments ({failedCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("Pending Audit");
                      setIsStatusOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${activeTab === "Pending Audit"
                      ? "bg-amber-100 text-amber-950 font-extrabold"
                      : "text-amber-900 hover:bg-amber-50"
                      }`}
                  >
                    <Clock size={14} className="text-amber-600" />
                    <span>Pending Audit ({pendingAuditCount})</span>
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
                <Building2
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <span className="block truncate pr-2">
                  {selectedCollege === "All"
                    ? "All Partner Colleges"
                    : selectedCollege}
                </span>
                <ChevronDown
                  size={14}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isCollegeOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCollegeOpen && (
                <div className="absolute left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 space-y-0.5 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCollege("All");
                      setIsCollegeOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${selectedCollege === "All"
                      ? "bg-slate-100 text-slate-900 font-extrabold"
                      : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    All Partner Colleges
                  </button>
                  {allCollegeNames.map((name, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedCollege(name);
                        setIsCollegeOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer truncate ${selectedCollege === name
                        ? "bg-blue-50 text-[#2D73B4] font-bold"
                        : "text-slate-700 hover:bg-slate-50"
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
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search student, email, txn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4]"
              />
            </div>
          </div>
        </div>

        {/* Applications Data Table */}
        <div className="bg-white rounded-lg border border-gray-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold tracking-wider text-slate-500">
                  <th className="py-2.5 px-3.5">Student</th>
                  <th className="py-2.5 px-3.5">College & Venue</th>
                  <th className="py-2.5 px-3.5">Program</th>
                  <th className="py-2.5 px-3.5">Payment Status</th>
                  <th className="py-2.5 px-3.5">Verification</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                      <div className="flex justify-center">
                        <Loader2 className="w-8 h-8 text-[#2D73B4] animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-slate-400 font-medium"
                    >
                      No application records match your selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              app.selfiePhotoUrl ||
                              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"
                            }
                            alt={app.studentName}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-2xs"
                          />
                          <div>
                            <p className="font-bold text-slate-800 text-xs sm:text-sm">
                              {app.studentName}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {app.email} &bull; {app.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* College & Venue */}
                      <td className="py-2.5 px-3.5">
                        <p className="font-semibold text-slate-800 line-clamp-1">
                          {app.collegeName}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin
                            size={12}
                            className="text-slate-400 shrink-0"
                          />
                          <span className="truncate">
                            {app.venueLocation || "Main Campus"}
                          </span>
                        </p>
                      </td>

                      {/* Program */}
                      <td className="py-2.5 px-3.5">
                        <span className="font-medium text-slate-700 bg-gray-100 px-2 py-0.5 rounded-md text-[11px]">
                          {app.programTitle}
                        </span>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-2.5 px-3.5">
                        {app.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={12} />
                            Paid ({app.amountPaid === 0 ? 'FREE' : `₹${app.amountPaid !== undefined && app.amountPaid !== null ? app.amountPaid : 0}`})
                          </span>
                        ) : app.paymentStatus === "Failed" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                            <AlertCircle size={12} />
                            Payment Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <Clock size={12} />
                            Pending Payment
                          </span>
                        )}
                      </td>

                      {/* Verification Status */}
                      <td className="py-2.5 px-3.5">
                        {app.verificationStatus === "Verified" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            Verified
                          </span>
                        ) : app.verificationStatus === "Flagged" ? (
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
                      <td className="py-2.5 px-3.5 text-right">
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
                  <h3 className="font-bold text-slate-900 text-base">
                    Student Application Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID: {selectedApp.id} &bull; Transaction:{" "}
                    {selectedApp.transactionId || "N/A"}
                  </p>
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
                  src={
                    selectedApp.selfiePhotoUrl ||
                    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop"
                  }
                  alt={selectedApp.studentName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <h4 className="font-bold text-slate-900 text-lg">
                    {selectedApp.studentName}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail size={13} className="text-slate-400" />
                    {selectedApp.email}
                  </p>
                  <p className="text-xs text-slate-600 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone size={13} className="text-slate-400" />
                    {selectedApp.phone}
                  </p>
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                    {selectedApp.paymentStatus === "Paid" ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        Paid ({selectedApp.amountPaid === 0 ? 'FREE' : `₹${selectedApp.amountPaid !== undefined && selectedApp.amountPaid !== null ? selectedApp.amountPaid : 0}`})
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        Payment Failed (
                        {selectedApp.paymentFailureReason || "Cancelled"})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic & Venue Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Institution / College
                  </p>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedApp.collegeName}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Venue Location
                  </p>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedApp.venueLocation || "Main Campus"}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Branch & Degree
                  </p>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedApp.degree || "B.Tech"} &bull;{" "}
                    {selectedApp.branch || "CSE"}
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Academic Marks %
                  </p>
                  <p className="font-bold text-slate-800 text-sm">
                    10th: {selectedApp.marksTenth || "85%"} | 12th/Diploma:{" "}
                    {selectedApp.marksTwelfth || "88%"}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Verification */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedApp.id, "Verified")
                    }
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    Verify Record
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedApp.id, "Flagged")
                    }
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

export default DashboardHome;
