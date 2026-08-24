import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Check,
  Filter,
  Calendar,
  MapPin,
  Sparkles,
  RotateCcw,
  Upload,
  Eye,
  ChevronDown
} from 'lucide-react';
import {
  getGalleryItems,
  saveGalleryItem,
  deleteGalleryItem,
  resetGalleryItems
} from '../../services/galleryService';
import { GALLERY_CATEGORIES } from '../../constants/gallery';

const MAIN_CATEGORIES = [
  { id: 'all', label: 'All Media' },
  { id: 'ai-summit', label: 'AI Summit' },
  { id: 'workshops', label: 'Campus Workshops' }
];

const EXTRA_CATEGORIES = [
  { id: 'data-science', label: 'Data Science Labs' },
  { id: 'hackathons', label: 'Hackathons & Research' },
  { id: 'certifications', label: 'Certifications & MOUs' }
];

export const ManageGallery = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const catDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'ai-summit',
    categoryName: 'AI Summit',
    image: '',
    date: '',
    location: '',
    description: ''
  });

  const categoryMap = {
    'ai-summit': 'AI Summit',
    'workshops': 'Campus Workshops',
    'data-science': 'Data Science Labs',
    'hackathons': 'Hackathons & Research',
    'certifications': 'Certifications & MOUs'
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getGalleryItems();
    setItems(data);
    setFilteredItems(data);
  };

  useEffect(() => {
    let result = items;

    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }

    setFilteredItems(result);
  }, [searchTerm, selectedCategory, items]);

  const showNotification = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'ai-summit',
      categoryName: 'AI Summit',
      image: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      location: 'Main Campus',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'ai-summit',
      categoryName: item.categoryName || categoryMap[item.category] || 'AI Summit',
      image: item.image || '',
      date: item.date || '',
      location: item.location || '',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleCategoryChange = (catKey) => {
    setFormData(prev => ({
      ...prev,
      category: catKey,
      categoryName: categoryMap[catKey] || 'AI Summit'
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.image.trim()) {
      showNotification('Title and Image are required', 'error');
      return;
    }

    const payload = editingItem ? { id: editingItem.id, ...formData } : formData;

    const res = saveGalleryItem(payload);
    if (res.success) {
      showNotification(
        editingItem ? 'Gallery card updated successfully!' : 'New Gallery card added!'
      );
      loadData();
      setIsModalOpen(false);
    } else {
      showNotification('Failed to save gallery card', 'error');
    }
  };

  const handleDelete = (id) => {
    const res = deleteGalleryItem(id);
    if (res.success) {
      showNotification('Gallery card deleted successfully!');
      loadData();
      setDeleteConfirmId(null);
    } else {
      showNotification('Failed to delete card', 'error');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset gallery to default cards? Custom added cards will be removed.')) {
      resetGalleryItems();
      loadData();
      showNotification('Gallery reset to default!');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-xl text-white font-medium text-xs sm:text-sm flex items-center gap-2 ${
              feedback.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
            }`}
          >
            <Check size={18} />
            <span>{feedback.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ImageIcon size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Gallery</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Add, update, or remove media cards shown in the public Gallery section.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-white border-2 border-slate-800 text-slate-900 font-extrabold rounded-lg hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/40 transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm cursor-pointer shadow-xs"
          >
            <Plus size={16} />
            <span>Add New Media</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-medium text-gray-500">Total Gallery Cards</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{items.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-medium text-gray-500">AI Summit Media</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {items.filter(i => i.category === 'ai-summit').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-medium text-gray-500">Campus Workshops</p>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            {items.filter(i => i.category === 'workshops').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-medium text-gray-500">Data Science Labs</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">
            {items.filter(i => i.category === 'data-science').length}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 relative z-20">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cards by title or location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap relative z-20">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0 mr-1">
            <Filter size={14} className="text-emerald-600" /> Category:
          </span>

          {/* Main Categories */}
          {MAIN_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setIsCatDropdownOpen(false); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-700 shadow-xs'
                    : 'bg-white border-2 border-slate-800 text-slate-900 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          {/* Extra Categories Dropdown */}
          {(() => {
            const isExtraActive = EXTRA_CATEGORIES.some(c => c.id === selectedCategory);
            const activeExtraObj = EXTRA_CATEGORIES.find(c => c.id === selectedCategory);

            return (
              <div className="relative shrink-0" ref={catDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                    isExtraActive
                      ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-700 shadow-xs'
                      : isCatDropdownOpen
                      ? 'bg-emerald-50/40 border-2 border-emerald-600 text-emerald-600'
                      : 'bg-white border-2 border-slate-800 text-slate-900 hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/40'
                  }`}
                >
                  <span>{isExtraActive ? activeExtraObj?.label : 'More'}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCatDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] py-1.5 overflow-hidden"
                    >
                      {EXTRA_CATEGORIES.map(cat => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setIsCatDropdownOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 text-xs text-left flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                                : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 font-semibold'
                            }`}
                          >
                            <span>{cat.label}</span>
                            {isSelected && <Check size={14} className="text-emerald-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image Box */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-white uppercase tracking-wider">
                {item.categoryName || categoryMap[item.category] || 'Gallery'}
              </div>
            </div>

            {/* Content Box */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Meta Info: Date & Location */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={13} className="text-gray-400" />
                  <span>{item.date || '2026'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={13} className="text-gray-400" />
                  <span className="truncate max-w-[120px]">{item.location || 'Campus'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-all cursor-pointer"
                  title="Delete Card"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
          <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-700">No Gallery Cards Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            No media matching "{searchTerm}" in category "{selectedCategory}".
          </p>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-gray-200"
            >
              {/* Modal Header */}
              <div className="p-5 bg-white text-slate-900 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon size={20} className="text-emerald-600" />
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {editingItem ? 'Edit Gallery Card' : 'Add New Gallery Card'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Card Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Card Title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10"
                  />
                </div>

                {/* Category & Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => handleCategoryChange(e.target.value)}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 cursor-pointer"
                    >
                      <option value="ai-summit">AI Summit</option>
                      <option value="workshops">Campus Workshops</option>
                      <option value="data-science">Data Science Labs</option>
                      <option value="hackathons">Hackathons & Research</option>
                      <option value="certifications">Certifications & MOUs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      placeholder="Date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10"
                    />
                  </div>
                </div>

                {/* Location & Image Source */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="Location"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Image Source</label>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-gray-300 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload size={14} />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="or paste URL (/images/ai-summit/gallery-1.jpg)"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Preview Box */}
                {formData.image && (
                  <div className="mt-2 relative h-32 rounded-lg overflow-hidden border border-gray-200 bg-slate-100">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] text-white font-semibold flex items-center gap-1">
                      <Eye size={12} /> Image Preview
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a brief summary of what's happening in this media item..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-white border-2 border-slate-800 text-slate-900 font-extrabold rounded-lg hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/40 transition-all duration-200 text-xs sm:text-sm cursor-pointer shadow-xs"
                  >
                    {editingItem ? 'Save Changes' : 'Add Gallery Card'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-6 rounded-xl max-w-sm w-full text-center space-y-4 border border-gray-200 shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Delete Gallery Card?</h3>
                <p className="text-xs text-gray-500 mt-1">
                  This card will be permanently removed from the public gallery.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageGallery;
