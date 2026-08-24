import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  Tag,
  ChevronDown,
  X
} from 'lucide-react';
import DateInput, { isoToDDMMYYYY, isValidDDMMYYYY } from '../../components/ui/DateInput';
import { getSummits, fetchSummitsAsync, saveSummits, formatEventDates } from '../../services/summitService';
import { saveApplications } from '../../services/applicationService';
import ProgramCard from '../../components/ui/ProgramCard';

const parseTimeStr = (timeStr) => {
  if (!timeStr) {
    return { startTime: '10:00', startAmPm: 'AM', endTime: '05:00', endAmPm: 'PM' };
  }
  const match = timeStr.match(/^(\d{1,2}:\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)/i);
  if (match) {
    return {
      startTime: match[1],
      startAmPm: match[2].toUpperCase(),
      endTime: match[3],
      endAmPm: match[4].toUpperCase()
    };
  }
  return { startTime: '10:00', startAmPm: 'AM', endTime: '05:00', endAmPm: 'PM' };
};

const ManageWorkshops = () => {
  const [workshops, setWorkshops] = useState(() => getSummits());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    totalHours: '',
    durationDays: 1,
    startTime: '10:00',
    startAmPm: 'AM',
    endTime: '05:00',
    endAmPm: 'PM',
    startDate: '',
    endDate: '',
    date: '',
    college: '',
    address: '',
    status: 'Registration Open',
    type: 'Campus Workshop',
    seatCapacity: 100,
    price: 999,
    originalPrice: 2999,
    taxRate: 18,
    taxMode: 'Exclusive',
    processingFee: 0,
    processingFeeType: 'Percentage',
    features: ''
  });

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const resApps = await fetch("/api/v1/applications");
        const jsonApps = await resApps.json();
        if (jsonApps.success && Array.isArray(jsonApps.data) && jsonApps.data.length > 0) {
          saveApplications(jsonApps.data);
        }
      } catch (err) {
        console.log("Applications fetch error notice");
      }

      const data = await fetchSummitsAsync();
      setWorkshops(data);
    };
    loadWorkshops();
    window.addEventListener("applications_updated", loadWorkshops);
    window.addEventListener("summits_updated", loadWorkshops);
    return () => {
      window.removeEventListener("applications_updated", loadWorkshops);
      window.removeEventListener("summits_updated", loadWorkshops);
    };
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      totalHours: '',
      durationDays: 1,
      startTime: '10:00',
      startAmPm: 'AM',
      endTime: '05:00',
      endAmPm: 'PM',
      startDate: '',
      endDate: '',
      date: '',
      college: '',
      address: '',
      status: 'Registration Open',
      type: 'Campus Workshop',
      seatCapacity: 100,
      price: 999,
      originalPrice: 2999,
      taxRate: 18,
      taxMode: 'Exclusive',
      processingFee: 0,
      processingFeeType: 'Percentage',
      features: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    const parsedDays = parseInt(item.duration) || 1;
    const timeParsed = parseTimeStr(item.time);
    let parsedHours = (item.totalHours !== undefined && item.totalHours !== null) ? String(item.totalHours) : "";
    if (!parsedHours && item.duration) {
      const hMatch = String(item.duration).match(/(\d+)\s*(?:hrs|hours)/i);
      if (hMatch) parsedHours = hMatch[1];
    }
    setFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      totalHours: parsedHours,
      durationDays: parsedDays,
      startTime: timeParsed.startTime,
      startAmPm: timeParsed.startAmPm,
      endTime: timeParsed.endTime,
      endAmPm: timeParsed.endAmPm,
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      date: item.date || '',
      college: item.college || '',
      address: item.address || '',
      status: item.status || 'Registration Open',
      type: item.type || 'Campus Workshop',
      seatCapacity: item.seatCapacity !== undefined ? item.seatCapacity : 100,
      price: item.price !== undefined ? item.price : 999,
      originalPrice: item.originalPrice || 2999,
      taxRate: item.taxRate !== undefined ? item.taxRate : 18,
      taxMode: item.taxMode || 'Exclusive',
      processingFee: (item.processingFee !== undefined && item.processingFee !== null) ? item.processingFee : 0,
      processingFeeType: (item.processingFeeType && item.processingFeeType !== 'Fixed') ? item.processingFeeType : 'Percentage',
      features: (item.features || []).join('\n')
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      const updated = workshops.filter(w => w.id !== id);
      setWorkshops(updated);
      saveSummits(updated);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startDate) {
      const startDisp = isoToDDMMYYYY(formData.startDate);
      if (!isValidDDMMYYYY(startDisp)) {
        alert("Please enter a valid Start Date in DD/MM/YYYY format.");
        return;
      }
    }

    if (formData.endDate) {
      const endDisp = isoToDDMMYYYY(formData.endDate);
      if (!isValidDDMMYYYY(endDisp)) {
        alert("Please enter a valid End Date in DD/MM/YYYY format.");
        return;
      }
    }

    const days = parseInt(formData.durationDays) || 1;
    const duration = `${days}-Day Live Workshop`;
    const timeStr = `${formData.startTime || '10:00'} ${formData.startAmPm || 'AM'} - ${formData.endTime || '05:00'} ${formData.endAmPm || 'PM'}`;

    const finalEndDate = formData.endDate || formData.startDate;
    const formattedDate = (formData.startDate || formData.endDate)
      ? formatEventDates(formData.startDate, finalEndDate)
      : formData.date;

    const featStr = typeof formData.features === 'string' ? formData.features : '';
    const workshopData = {
      ...formData,
      totalHours: formData.totalHours ? String(formData.totalHours).trim() : "",
      duration: duration,
      time: timeStr,
      date: formattedDate,
      seatCapacity: Number(formData.seatCapacity || 100),
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      taxRate: Number(formData.taxRate),
      processingFee: Number(formData.processingFee),
      processingFeeType: formData.processingFeeType || 'Percentage',
      features: featStr.split('\n').filter(f => f.trim() !== '')
    };

    if (editingId) {
      await updateSummit(editingId, workshopData);
    } else {
      await addSummit(workshopData);
    }

    setWorkshops(getSummits());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Campus Workshops</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Configure workshop offerings, venue locations, timings, pricing, and GST tax settings.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#2D73B4] text-white rounded-xl text-sm font-semibold hover:bg-[#235b8f] transition-all flex items-center gap-2 shadow-md shadow-[#2D73B4]/20 cursor-pointer"
        >
          <Plus size={18} />
          Create New
        </button>
      </div>

      {/* Grid View */}
      <div className="flex flex-wrap justify-center gap-6">
        {workshops.map((item, index) => (
          <div key={item.id} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
            <ProgramCard
              summit={item}
              isAdmin={true}
              onEdit={() => openEditModal(item)}
              onDelete={() => handleDelete(item.id)}
            />
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId ? 'Edit Program' : 'Create New'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Workshop Title *</label>
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Workshop Title"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subtitle / Track</label>
                  <input
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Subtitle / Track"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College Institution *</label>
                  <input
                    required
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    placeholder="College Institution"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue Location *</label>
                  <input
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Venue Location"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 h-5 flex items-center">Total Hours & Duration</label>
                  <div className="flex items-center gap-2">
                    {/* Manual Total Hours Input (Left Side) */}
                    <div className="flex items-center w-1/2 h-10 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2D73B4]/20 focus-within:border-[#2D73B4] transition-all">
                      <input
                        type="number"
                        min="1"
                        max="500"
                        name="totalHours"
                        value={formData.totalHours || ''}
                        onChange={handleInputChange}
                        className="w-12 h-full px-2 text-center text-sm font-bold outline-none bg-transparent text-slate-800"
                        placeholder="10"
                      />
                      <div className="h-full border-l border-gray-200 flex items-center flex-1 px-2 bg-slate-50 text-xs font-semibold text-slate-700 select-none">
                        Hrs
                      </div>
                    </div>

                    {/* Duration Days Input (Right Side) */}
                    <div className="flex items-center w-1/2 h-10 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2D73B4]/20 focus-within:border-[#2D73B4] transition-all">
                      <input
                        type="number"
                        min="1"
                        name="durationDays"
                        value={formData.durationDays}
                        onChange={handleInputChange}
                        className="w-10 h-full px-2 text-center text-sm font-bold outline-none bg-transparent text-slate-800"
                        placeholder="1"
                      />
                      <div className="h-full border-l border-gray-200 flex items-center flex-1 px-2 bg-slate-50 text-xs font-semibold text-slate-700 select-none">
                        -Day Workshop
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 h-5 flex items-center">Workshop Timing / Hours</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center flex-1 h-10 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2D73B4]/20 focus-within:border-[#2D73B4] transition-all">
                      <input
                        type="text"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full h-full px-3 text-xs font-semibold outline-none bg-transparent text-slate-800 min-w-0"
                        placeholder="10:00"
                      />
                      <div className="relative h-full border-l border-gray-200 flex items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                        <select
                          name="startAmPm"
                          value={formData.startAmPm}
                          onChange={handleInputChange}
                          className="h-full pl-2.5 pr-6 text-xs bg-transparent font-bold outline-none text-slate-700 cursor-pointer appearance-none"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <span className="text-gray-400 font-bold text-xs shrink-0">to</span>

                    <div className="flex items-center flex-1 h-10 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2D73B4]/20 focus-within:border-[#2D73B4] transition-all">
                      <input
                        type="text"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full h-full px-3 text-xs font-semibold outline-none bg-transparent text-slate-800 min-w-0"
                        placeholder="05:00"
                      />
                      <div className="relative h-full border-l border-gray-200 flex items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                        <select
                          name="endAmPm"
                          value={formData.endAmPm}
                          onChange={handleInputChange}
                          className="h-full pl-2.5 pr-6 text-xs bg-transparent font-bold outline-none text-slate-700 cursor-pointer appearance-none"
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Date</label>
                  <DateInput
                    required
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-xs font-semibold text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date (Optional)</label>
                  <DateInput
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-xs font-semibold text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seats Limit / Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    name="seatCapacity"
                    value={formData.seatCapacity}
                    onChange={handleInputChange}
                    placeholder="Seats Limit"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg outline-none font-semibold text-slate-800 bg-white appearance-none cursor-pointer"
                    >
                      <option value="Registration Open">Registration Open</option>
                      <option value="Filling Fast">Filling Fast</option>
                      <option value="Closed">Closed</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Pricing & GST Section */}
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <DollarSign size={14} className="text-[#2D73B4]" />
                  Pricing & GST Tax Settings
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 h-5 flex items-center whitespace-nowrap">Enrollment Fee (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 py-2 border border-gray-200 rounded-lg font-bold outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 h-5 flex items-center whitespace-nowrap">GST (%)</label>
                    <input
                      type="number"
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 py-2 border border-gray-200 rounded-lg font-bold outline-none text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1 h-5">
                      <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Gateway</label>
                      {formData.processingFeeType === 'Percentage' && (
                        <span className="text-[10px] text-emerald-600 font-bold truncate ml-1">
                          = ₹{Math.round((Number(formData.price || 0) * Number(formData.processingFee || 0)) / 100)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center w-full h-10 border border-gray-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#2D73B4]/20 focus-within:border-[#2D73B4] transition-all">
                      <input
                        type="number"
                        name="processingFee"
                        value={formData.processingFee}
                        onChange={handleInputChange}
                        className="w-full h-full px-3 text-sm font-semibold outline-none bg-transparent text-slate-800 placeholder-gray-400 min-w-0"
                        placeholder="0"
                      />
                      <div className="relative h-full border-l border-gray-200 flex items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                        <select
                          name="processingFeeType"
                          value={formData.processingFeeType || 'Percentage'}
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
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Features (One per line)</label>
                <textarea
                  rows="3"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Hands-on AI Lab&#10;Verified Certificate&#10;Expert Mentorship"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-slate-700 rounded-xl font-semibold hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2D73B4] text-white rounded-xl font-semibold hover:bg-[#235b8f]"
                >
                  {editingId ? 'Save Changes' : 'Create Workshop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageWorkshops;
