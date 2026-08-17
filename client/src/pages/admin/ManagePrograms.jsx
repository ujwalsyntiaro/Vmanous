import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, CheckCircle2, Building2, LayoutGrid, List } from 'lucide-react';
import { getSummits, addSummit, updateSummit, deleteSummit } from '../../services/summitService';
import ProgramCard from '../../components/ui/ProgramCard';

const ManagePrograms = () => {
  const [summits, setSummits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    duration: '',
    date: '',
    college: '',
    type: 'Flagship Event',
    features: ''
  });

  useEffect(() => {
    setSummits(getSummits());
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      duration: '',
      date: '',
      college: '',
      type: 'Flagship Event',
      features: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (summit) => {
    setEditingId(summit.id);
    setFormData({
      title: summit.title,
      subtitle: summit.subtitle,
      duration: summit.duration,
      date: summit.date,
      college: summit.college,
      type: summit.type || 'Flagship Event',
      features: summit.features.join('\n')
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
    const summitData = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim() !== '')
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vmanous-navy-dark">Manage AI Summits</h1>
          <p className="text-gray-500 mt-1">Add, edit, or remove upcoming programs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-vmanous-navy-dark' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-gray-100 text-vmanous-navy-dark' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#2D73B4] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} />
            Add Program
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summits.map((summit, index) => (
            <ProgramCard
              key={summit.id}
              summit={summit}
              index={index}
              isAdmin={true}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
          {summits.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
              No programs found. Add a new program.
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
                <th className="px-6 py-4">College</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summits.map((summit) => (
                <tr key={summit.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-vmanous-navy-dark">{summit.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{summit.subtitle}</div>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md">
                      {summit.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-gray-400" />
                      <span className="font-medium">{summit.college}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span>{summit.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{summit.date}</span>
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
              {summits.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No programs found. Add a new program to display on the enroll page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-vmanous-navy-dark">
                {editingId ? 'Edit Program' : 'Add New Program'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="programForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                    <input 
                      required 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none"
                      placeholder="e.g., AI Summit 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Program Type</label>
                    <input 
                      required 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none"
                      placeholder="e.g., Flagship Event"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
                  <input 
                    required 
                    name="subtitle" 
                    value={formData.subtitle} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none"
                    placeholder="e.g., Certificate Program in Generative AI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">College / Institution</label>
                  <input 
                    required 
                    name="college" 
                    value={formData.college} 
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none"
                    placeholder="e.g., National Institute of Technology"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                    <input 
                      required 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none"
                      placeholder="e.g., 6 Months"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date / Status</label>
                    <input 
                      required 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none"
                      placeholder="e.g., Starts Oct 2026"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Features (One per line)</label>
                  <textarea 
                    required 
                    name="features" 
                    value={formData.features} 
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] outline-none resize-none"
                    placeholder="Weekend Classes&#10;No Coding Required&#10;Perfect for Non-Techies"
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="programForm"
                className="px-5 py-2 bg-[#2D73B4] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                {editingId ? 'Save Changes' : 'Add Program'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePrograms;
