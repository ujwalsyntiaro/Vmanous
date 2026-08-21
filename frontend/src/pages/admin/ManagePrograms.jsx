import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, CheckCircle2, Building2, LayoutGrid, List, Receipt, DollarSign, History, Users } from 'lucide-react';
import { getSummits, addSummit, updateSummit, deleteSummit, formatEventDates, isSummitActive } from '../../services/summitService';
import ProgramCard from '../../components/ui/ProgramCard';
import DateInput from '../../components/ui/DateInput';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
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
    seatCapacity: 100,
    price: 1999,
    originalPrice: 4999,
    taxRate: 18,
    taxMode: "Exclusive",
    processingFee: 0,
    processingFeeType: "Fixed",
    features: "",
  });

  const loadSummits = async () => {
    try {
      const res = await fetch("/api/v1/summits");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setSummits(data.data);
        return;
      }
    } catch (err) {
      console.warn(
        "Backend API summit fetch failed, falling back to local service:",
        err,
      );
    }
    setSummits(getSummits());
  };

  useEffect(() => {
    loadSummits();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      subtitle: "",
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
      seatCapacity: 100,
      price: 1999,
      originalPrice: 4999,
      taxRate: 18,
      taxMode: "Exclusive",
      processingFee: 0,
      processingFeeType: "Fixed",
      features: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (summit) => {
    setEditingId(summit.id);
    const parsedDays = parseInt(summit.duration) || 2;
    const timeParsed = parseTimeStr(summit.time);
    setFormData({
      title: summit.title || "",
      subtitle: summit.subtitle || "",
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
      seatCapacity:
        summit.seatCapacity !== undefined ? summit.seatCapacity : 100,
      price: summit.price !== undefined ? summit.price : 1999,
      originalPrice: summit.originalPrice || 4999,
      taxRate: summit.taxRate !== undefined ? summit.taxRate : 18,
      taxMode: summit.taxMode || "Exclusive",
      processingFee: summit.processingFee || 0,
      processingFeeType: summit.processingFeeType || "Fixed",
      features: (summit.features || []).join("\n"),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      deleteSummit(id);
      setSummits(getSummits());
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const days = parseInt(formData.durationDays) || 1;
    const duration = `${days}-Day Live Workshop`;
    const timeStr = `${formData.startTime || "10:00"} ${formData.startAmPm || "AM"} - ${formData.endTime || "05:00"} ${formData.endAmPm || "PM"}`;

    const formattedDate =
      formData.startDate || formData.endDate
        ? formatEventDates(formData.startDate, formData.endDate)
        : formData.date;

    const summitData = {
      ...formData,
      duration: duration,
      time: timeStr,
      date: formattedDate,
      seatCapacity: Number(formData.seatCapacity || 100),
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      taxRate: Number(formData.taxRate),
      processingFee: Number(formData.processingFee),
      processingFeeType: formData.processingFeeType || "Fixed",
      features: formData.features.split("\n").filter((f) => f.trim() !== ""),
    };

    if (editingId) {
      updateSummit(editingId, summitData);
    } else {
      addSummit(summitData);
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
            Create New Workshop
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
                        <div className="flex justify-end gap-3">
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

      {/* Add/Edit Modal (Structured Vertical Design) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 shrink-0">
              <h2 className="text-base sm:text-lg font-bold text-vmanous-navy-dark">
                {editingId ? "Edit Workshop Program" : "Create New Workshop"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none px-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Form Body (Vertical Stacked Layout) */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <form
                id="programForm"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Section 1: Basic Information */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs font-medium"
                        placeholder="e.g., AI Summit Workshop 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Program Type *
                      </label>
                      <input
                        required
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs"
                        placeholder="e.g., Flagship Event"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Subtitle *
                    </label>
                    <input
                      required
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs"
                      placeholder="e.g., Generative AI, Prompt Engineering & Agentic LLMs"
                    />
                  </div>
                </div>

                {/* Section 2: College & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      College / Institution *
                    </label>
                    <input
                      required
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs font-medium"
                      placeholder="e.g., National Institute of Technology"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Venue Location
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs"
                      placeholder="e.g., Main Auditorium, NIT Campus"
                    />
                  </div>
                </div>

                {/* Section 3: Pricing & Tax Management */}
                <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    <Receipt className="w-4 h-4 text-[#2D73B4]" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Pricing & Tax Management
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Enrollment Fee (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs font-bold text-slate-800 bg-white"
                        placeholder="1999"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        GST (%)
                      </label>
                      <input
                        type="number"
                        name="taxRate"
                        value={formData.taxRate}
                        onChange={handleInputChange}
                        className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs bg-white"
                        placeholder="18"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Platform Fee
                      </label>
                      <div className="flex items-center w-full h-9 border border-gray-200 rounded-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2D73B4]/20 focus-within:border-[#2D73B4]">
                        <input
                          type="number"
                          name="processingFee"
                          value={formData.processingFee}
                          onChange={handleInputChange}
                          className="w-full h-full px-2.5 text-xs font-semibold outline-none bg-transparent text-slate-800 min-w-0"
                          placeholder="0"
                        />
                        <select
                          name="processingFeeType"
                          value={formData.processingFeeType || "Fixed"}
                          onChange={handleInputChange}
                          className="h-full px-2 text-xs bg-slate-50 border-l border-gray-200 font-bold outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="Fixed">₹</option>
                          <option value="Percentage">%</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Tax Mode
                    </label>
                    <select
                      name="taxMode"
                      value={formData.taxMode}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs bg-white font-medium"
                    >
                      <option value="Exclusive">
                        Exclusive (Add GST % extra at checkout)
                      </option>
                      <option value="Inclusive">
                        Inclusive (GST included in price)
                      </option>
                      <option value="Free">Free / No Charge</option>
                    </select>
                  </div>
                </div>

                {/* Section 4: Schedule, Dates & Seats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Duration
                    </label>
                    <div className="flex items-center w-full h-9 border border-gray-200 rounded-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2D73B4]/20 focus-within:border-[#2D73B4]">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        required
                        name="durationDays"
                        value={formData.durationDays}
                        onChange={handleInputChange}
                        className="w-14 h-full px-2 text-center text-xs font-bold outline-none bg-transparent text-slate-800"
                        placeholder="1"
                      />
                      <div className="h-full border-l border-gray-200 flex items-center flex-1 px-3 bg-slate-50 text-xs font-semibold text-slate-700 select-none">
                        -Day Live Workshop
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Workshop Timing
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center flex-1 h-9 border border-gray-200 rounded-md bg-white overflow-hidden min-w-0">
                        <input
                          type="text"
                          required
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="w-full h-full px-2 text-xs font-semibold outline-none bg-transparent text-slate-800 min-w-0"
                          placeholder="10:00"
                        />
                        <select
                          name="startAmPm"
                          value={formData.startAmPm}
                          onChange={handleInputChange}
                          className="h-full px-1.5 text-xs bg-slate-50 border-l border-gray-200 font-bold outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <span className="text-gray-400 font-bold text-xs shrink-0">
                        to
                      </span>
                      <div className="flex items-center flex-1 h-9 border border-gray-200 rounded-lg bg-white overflow-hidden min-w-0">
                        <input
                          type="text"
                          required
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="w-full h-full px-2 text-xs font-semibold outline-none bg-transparent text-slate-800 min-w-0"
                          placeholder="05:00"
                        />
                        <select
                          name="endAmPm"
                          value={formData.endAmPm}
                          onChange={handleInputChange}
                          className="h-full px-1.5 text-xs bg-slate-50 border-l border-gray-200 font-bold outline-none text-slate-700 cursor-pointer"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <DateInput
                      required
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs font-semibold text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      End Date *
                    </label>
                    <DateInput
                      required
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs font-semibold text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Seats Limit / Capacity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      name="seatCapacity"
                      value={formData.seatCapacity}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs font-bold text-slate-800"
                      placeholder="e.g., 100 or 20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Event Status / Badge
                    </label>
                    <input
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-9 px-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs"
                      placeholder="e.g., Registration Open, Live Now, Upcoming"
                    />
                  </div>
                </div>

                {/* Section 5: Features List */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Features (One per line)
                  </label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none text-xs resize-none"
                    placeholder="Weekend Classes&#10;No Coding Required&#10;Perfect for Non-Techies"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 text-xs font-bold hover:bg-gray-200/60 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="programForm"
                className="px-5 py-2 bg-[#2D73B4] text-white text-xs font-bold rounded-md hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                {editingId ? "Save Changes" : "Create Workshop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePrograms;
