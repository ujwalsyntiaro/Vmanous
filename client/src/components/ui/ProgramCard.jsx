import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, CheckCircle2, ArrowRight, Edit2, Trash2 } from 'lucide-react';

const ProgramCard = ({ summit, index = 0, isAdmin = false, onRegister, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-md border border-slate-200/80 shadow-md p-6 md:p-7 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 group h-full min-h-[320px]"
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

      <div className="flex-1 relative z-10 flex flex-col">
        {/* Event Type Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {summit.type || 'Flagship Event'}
          </span>
        </div>

        {/* Title & College */}
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 tracking-tight">
          {summit.title}
        </h3>

        {/* Light Highlighted College Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] tracking-wider uppercase mb-4 shadow-2xs self-start">
          <Building2 size={13} className="text-emerald-600 flex-shrink-0" />
          <span>{summit.college}</span>
        </div>

        {/* Schedule & Highlighted Date Box */}
        <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200/60 mb-4 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-emerald-600 text-white shadow-2xs">
              <Calendar size={14} />
            </div>
            <span className="text-xs font-extrabold text-slate-900 tracking-tight">{summit.duration}</span>
          </div>
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 shadow-2xs">
            {summit.date}
          </span>
        </div>

        {/* Subtitle / Objective */}
        <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed mb-4">
          {summit.subtitle}
        </p>

        {/* Features List (rendered only if present) */}
        {summit.features && summit.features.length > 0 && (
          <div className="space-y-2.5 mb-6 pt-2 border-t border-slate-100 flex-1">
            {summit.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-700 leading-snug">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Action */}
      <div className="mt-auto pt-4 border-t border-slate-100 relative z-10">
        {isAdmin ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit && onEdit(summit)}
              className="flex-1 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-600 font-semibold rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(summit.id)}
              className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-md hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onRegister && onRegister(summit)}
            className="w-full px-5 py-3.5 bg-transparent border-2 border-emerald-600 text-emerald-600 font-bold rounded-md hover:border-[3px] hover:border-emerald-700 hover:text-emerald-700 hover:shadow-md transition-all duration-150 flex items-center justify-center gap-2 text-sm cursor-pointer group/btn"
          >
            <span>Register Now</span>
            <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProgramCard;
