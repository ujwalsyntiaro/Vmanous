import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import Container from '../components/ui/Container';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from '../constants/gallery';
import { Link } from 'react-router-dom';

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const selectedItem = selectedImageIndex !== null ? filteredItems[selectedImageIndex] : null;

  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-vmanous-navy-dark">
      {/* 01 HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden bg-[#050816] text-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/network.jpg"
            alt="VMANOUS Network background"
            className="w-full h-full object-cover opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/80 via-[#050816]/70 to-[#050816]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-vmanous-green/15 rounded-full blur-[140px]" />
        </div>

        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
              <Sparkles size={14} className="text-vmanous-green animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-vmanous-green uppercase">
                VMANOUS MOMENTS & GALLERY
              </span>
            </div>

            <h1 
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-3xl md:text-5xl lg:text-6xl text-white tracking-wide mb-4 leading-tight"
            >
              Building the Future of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vmanous-green via-teal-400 to-vmanous-ai-blue font-normal">
                AI & Data Science
              </span>
            </h1>

            <p 
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              A visual journey across our practical AI workshops, campus hackathons, student research labs, and academic partnerships.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* 02 CATEGORY FILTER BAR */}
      <section className="py-8 bg-slate-50 border-b border-slate-200/80 sticky top-16 z-30 backdrop-blur-md bg-slate-50/90">
        <Container>
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-vmanous-green hidden sm:inline-block" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:inline-block">Filter:</span>
            </div>

            <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-x-auto no-scrollbar py-1">
              {GALLERY_CATEGORIES.map((cat) => {
                const count = cat.id === 'all' 
                  ? GALLERY_ITEMS.length 
                  : GALLERY_ITEMS.filter(i => i.category === cat.id).length;
                const isSelected = activeCategory === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#16A34A] text-white shadow-md shadow-green-600/20'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 03 GALLERY GRID */}
      <section className="py-12 md:py-16 bg-white">
        <Container>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className="group cursor-pointer rounded-3xl bg-slate-50 border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-vmanous-green/40 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image Box */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-vmanous-green border border-white/10 text-xs font-semibold uppercase tracking-wider">
                        {item.categoryName}
                      </span>
                    </div>

                    {/* Maximize Icon */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 size={16} />
                    </div>

                    {/* Location Badge */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-vmanous-green" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar size={14} />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-vmanous-green transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </Container>
      </section>

      {/* 04 LIGHTBOX MODAL PREVIEW */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImageIndex(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <X size={20} />
              </button>

              {/* Media Display Area */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain max-h-[70vh]"
                />

                {/* Left/Right Nav Controls */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-vmanous-green text-white flex items-center justify-center transition-colors border border-white/10"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-vmanous-green text-white flex items-center justify-center transition-colors border border-white/10"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Info Sidebar */}
              <div className="w-full lg:w-96 p-6 md:p-8 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between text-white">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vmanous-green/10 border border-vmanous-green/30 text-vmanous-green text-xs font-semibold uppercase tracking-wider mb-4">
                    <ImageIcon size={14} />
                    <span>{selectedItem.categoryName}</span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                    {selectedItem.title}
                  </h2>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-vmanous-green" />
                      <span>{selectedItem.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-vmanous-green" />
                      <span>{selectedItem.date}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Photo {selectedImageIndex + 1} of {filteredItems.length}</span>
                  <Link
                    to="/enroll"
                    className="inline-flex items-center gap-1.5 text-vmanous-green font-semibold hover:underline"
                  >
                    <span>Partnership Hub</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 05 PARTNERSHIP CTA */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <Container>
          <div className="max-w-4xl mx-auto bg-[#050816] rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-vmanous-green/20 rounded-full blur-3xl pointer-events-none" />
            <h2 
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-2xl md:text-4xl text-white mb-4 leading-tight"
            >
              Want to Bring VMANOUS AI Programs to Your Campus?
            </h2>
            <p 
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Partner with VMANOUS to set up practical AI & Data Science labs, conduct hands-on workshops, and provide student research exposure.
            </p>
            <Link
              to="/enroll"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#16A34A] hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-600/30 text-sm"
            >
              <span>Explore Campus Partnership</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Gallery;
