import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Tag } from 'lucide-react';

const dsGalleryDetails = [
  {
    title: "Data Analytics & Predictive Intelligence",
    category: "Data Science",
    description: "Data Scientists analyzing real-time data pipelines, statistical indicators, and data transformation workflows using Python & Pandas.",
    tags: ["Data Analytics", "Python", "Predictive Modeling"]
  },
  {
    title: "Machine Learning Model Optimization",
    category: "Machine Learning",
    description: "Training Scikit-learn models, hyperparameter optimization, and evaluating feature importance for real-world enterprise applications.",
    tags: ["Scikit-learn", "Feature Engineering", "MLOps"]
  },
  {
    title: "High-Tech Data Visualization Dashboard",
    category: "Business Intelligence",
    description: "Building interactive dashboards, metrics tracking, and visual analytics using Power BI, Seaborn, and Matplotlib.",
    tags: ["Power BI", "Data Viz", "Dashboards"]
  },
  {
    title: "Collaborative Student AI Research Project",
    category: "Student Projects",
    description: "Students collaborating on hands-on AI projects, model code reviews, and preparing research findings for publication.",
    tags: ["Collaboration", "AI Projects", "Mentorship"]
  }
];

const DataScienceGallery = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section className="py-10 md:py-14 bg-white relative">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {dsGalleryDetails.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedItem({ src: `/images/data-science/gallery-${index + 1}.jpg`, ...detail })}
              className="relative h-72 sm:h-80 md:h-96 lg:h-[400px] rounded-2xl overflow-hidden group shadow-lg border border-gray-100 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/90 via-[#050816]/30 to-transparent z-10 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6" />
              <img 
                src={`/images/data-science/gallery-${index + 1}.jpg`} 
                alt={detail.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-vmanous-navy-dark shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                <span>Click for Info</span>
                <Sparkles size={12} className="text-vmanous-ai-blue" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-20 text-white transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <span className="text-[11px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-vmanous-ai-blue text-white inline-block mb-1.5 shadow-sm">
                  {detail.category}
                </span>
                <h4 className="text-base sm:text-lg font-medium text-white line-clamp-2 drop-shadow-md">
                  {detail.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Info Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-vmanous-navy-dark/80 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-3xl bg-[#080B1A] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 text-gray-300 hover:text-white bg-white/10 rounded-full shadow-md hover:bg-white/20 backdrop-blur-md transition-all"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-900">
                <img 
                  src={selectedItem.src} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-400 mb-4">
                    <Tag size={12} />
                    <span>{selectedItem.category}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-medium text-white leading-snug mb-3">
                    {selectedItem.title}
                  </h3>

                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {selectedItem.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedItem.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">VMANOUS Data Science</span>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2 text-xs font-medium text-white bg-vmanous-green hover:bg-green-600 rounded-xl transition-all shadow-sm"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default DataScienceGallery;
