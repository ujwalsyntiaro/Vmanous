import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Users,
  MapPin,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Edit3,
  Trash2,
  Eye,
  X,
  Award
} from 'lucide-react';
import { getColleges, addCollege, updateCollege, deleteCollege } from '../../services/collegeService';
import { getStudents } from '../../services/studentService';

const ManageColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewStudentsCollege, setViewStudentsCollege] = useState(null); // For college student list modal

  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    city: '',
    state: '',
    address: '',
    mouStatus: 'Active MOU',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    totalSeatLimit: 100
  });

  useEffect(() => {
    setColleges(getColleges());
    setStudents(getStudents());
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      shortCode: '',
      city: '',
      state: '',
      address: '',
      mouStatus: 'Active MOU',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      totalSeatLimit: 100
    });
    setIsModalOpen(true);
  };

  const openEditModal = (col) => {
    setEditingId(col.id);
    setFormData({
      name: col.name || '',
      shortCode: col.shortCode || '',
      city: col.city || '',
      state: col.state || '',
      address: col.address || '',
      mouStatus: col.mouStatus || 'Active MOU',
      contactPerson: col.contactPerson || '',
      contactEmail: col.contactEmail || '',
      contactPhone: col.contactPhone || '',
      totalSeatLimit: col.totalSeatLimit || 100
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this college record?")) {
      const updated = deleteCollege(id);
      setColleges(updated);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateCollege(editingId, formData);
    } else {
      addCollege(formData);
    }
    setColleges(getColleges());
    setIsModalOpen(false);
  };

  const filteredColleges = colleges.filter((col) => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return col.name?.toLowerCase().includes(q) || col.city?.toLowerCase().includes(q) || col.shortCode?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Partner Colleges & Campus Seats</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage partner institutions, seat limits, MOU statuses, and campus student rosters.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#2D73B4] text-white rounded-xl text-sm font-semibold hover:bg-[#235b8f] transition-all flex items-center gap-2 shadow-md shadow-[#2D73B4]/20 cursor-pointer"
        >
          <Plus size={18} />
          Add New Partner College
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search college by name, city, shortcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4]"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Total Colleges: <span className="text-slate-900 font-bold">{colleges.length}</span>
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((col) => {
          // Count enrolled students for this college
          const collegeStudents = students.filter(s => s.collegeName === col.name);
          const occupiedSeats = collegeStudents.length;
          const totalSeats = col.totalSeatLimit || 100;
          const percentage = Math.min(100, Math.round((occupiedSeats / totalSeats) * 100));

          return (
            <div key={col.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-blue-50 text-[#2D73B4] font-extrabold text-xs rounded-lg uppercase tracking-wider">
                    {col.shortCode || 'CAMPUS'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    col.mouStatus === 'Active MOU' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {col.mouStatus || 'Active MOU'}
                  </span>
                </div>

                {/* College Title */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{col.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span>{col.address || `${col.city}, ${col.state}`}</span>
                  </p>
                </div>

                {/* Contact Person */}
                {col.contactPerson && (
                  <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
                    <p className="font-bold text-slate-800">{col.contactPerson}</p>
                    {col.contactEmail && <p className="text-slate-500">{col.contactEmail}</p>}
                  </div>
                )}

                {/* Seat Capacity Occupancy Bar */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Users size={14} className="text-[#2D73B4]" />
                      Enrolled Seats:
                    </span>
                    <span className="text-slate-900">
                      {occupiedSeats} / {totalSeats} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        percentage >= 90 ? 'bg-rose-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewStudentsCollege(col)}
                  className="px-3 py-1.5 bg-blue-50 text-[#2D73B4] hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye size={14} />
                  View Enrolled Students ({occupiedSeats})
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(col)}
                    className="p-1.5 text-slate-500 hover:text-[#2D73B4] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(col.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit College Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingId ? 'Edit Partner College' : 'Add New Partner College'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">College Name *</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. G H Raisoni College of Engineering"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Short Code *</label>
                  <input
                    required
                    name="shortCode"
                    value={formData.shortCode}
                    onChange={handleInputChange}
                    placeholder="e.g. GHRCEM"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Seat Limit *</label>
                  <input
                    type="number"
                    required
                    name="totalSeatLimit"
                    value={formData.totalSeatLimit}
                    onChange={handleInputChange}
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campus Address *</label>
                <input
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Hingna Road, Digdoh Hills, Nagpur"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person Name</label>
                  <input
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MOU Status</label>
                  <select
                    name="mouStatus"
                    value={formData.mouStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none font-semibold"
                  >
                    <option value="Active MOU">Active MOU</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Renewal Due">Renewal Due</option>
                  </select>
                </div>
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
                  {editingId ? 'Save Changes' : 'Add College'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* College Student List Modal */}
      {viewStudentsCollege && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Enrolled Students Roster</h3>
                <p className="text-xs text-slate-500 font-semibold">{viewStudentsCollege.name}</p>
              </div>
              <button onClick={() => setViewStudentsCollege(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X size={20} />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {students.filter(s => s.collegeName === viewStudentsCollege.name).length === 0 ? (
                <p className="py-8 text-center text-slate-400 font-medium text-xs">
                  No enrolled students registered for this college yet.
                </p>
              ) : (
                students.filter(s => s.collegeName === viewStudentsCollege.name).map((stu, index) => (
                  <div key={stu.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-[#2D73B4] font-bold text-center leading-6 text-xs">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{stu.studentName}</p>
                        <p className="text-slate-500 text-[11px]">{stu.email} &bull; {stu.branch}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-full">
                      {stu.passCode}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageColleges;
