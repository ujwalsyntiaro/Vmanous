import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, CheckCircle2, ArrowRight, Edit2, Trash2, MapPin, Clock } from 'lucide-react';
import { isSummitActive } from '../../services/summitService';

const ProgramCard = ({ summit, index = 0, isAdmin = false, onRegister, onEdit, onDelete }) => {
  if (!isAdmin && !isSummitActive(summit)) {
    return null;
  }

  const enrolledCount = (summit.enrolledCount !== undefined && summit.enrolledCount !== null)
    ? summit.enrolledCount
    : (Array.isArray(summit.applications)
      ? summit.applications.filter(a => a.paymentStatus === 'Paid' || !a.paymentStatus).length
      : 0);
  const seatCapacity = summit.seatCapacity || 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-3.5 sm:p-4 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl group h-full"
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

      <div className="flex-1 relative z-10 flex flex-col">
        {/* Event Type & Status Badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {summit.type || 'Flagship Event'}
          </span>
          <div className="flex flex-col items-end gap-1">
            {summit.status && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/60">
                {summit.status}
              </span>
            )}
            {summit.seatCapacity ? (
              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                <span className="text-emerald-700 font-extrabold">{enrolledCount}</span>/{seatCapacity} Seats
              </span>
            ) : null}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-1.5 tracking-tight">
          {summit.title}
        </h3>

        {/* College & Address Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] tracking-wider uppercase shadow-2xs">
            <Building2 size={13} className="text-emerald-600 flex-shrink-0" />
            <span>{summit.college}</span>
          </div>

          {summit.address && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/80 text-slate-700 border border-slate-200/80 font-semibold text-[11px] shadow-2xs">
              <MapPin size={13} className="text-emerald-600 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{summit.address}</span>
            </div>
          )}
        </div>

        {/* Schedule & Timing Box */}
        <div className="p-2 rounded-md bg-slate-50 border border-slate-200/60 mb-2 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-md bg-emerald-600 text-white shadow-2xs">
                <Calendar size={13} />
              </div>
              <span className="text-xs font-extrabold text-slate-900 tracking-tight">{summit.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs">
                {summit.date}
              </span>
            </div>
          </div>

          {summit.time && (
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/50 text-[11px] font-semibold text-slate-600">
              <Clock size={12} className="text-emerald-600 flex-shrink-0" />
              <span>{summit.time}</span>
            </div>
          )}
        </div>

        {/* Subtitle / Objective */}
        {summit.subtitle && (
          <p className="text-xs font-medium text-slate-600 leading-snug mb-1.5">
            {summit.subtitle}
          </p>
        )}

        {/* Features List (rendered only if present) */}
        {summit.features && summit.features.length > 0 && (
          <div className="space-y-1 mb-2 pt-1.5 border-t border-slate-100 flex-1">
            {summit.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                  <CheckCircle2 size={13} />
                </div>
                <span className="text-xs font-medium text-slate-700 leading-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Action */}
      <div className="mt-auto pt-2 border-t border-slate-100 relative z-10 flex items-center justify-between gap-3">
        {isAdmin ? (
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => onEdit && onEdit(summit)}
              className="flex-1 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 font-semibold rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Edit2 size={15} />
              Edit
            </button>
            <button
              onClick={() => onDelete && onDelete(summit.id)}
              className="px-3.5 py-2 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-md hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ) : (
          <>
            {/* Left side: Only Seats Left */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                {Math.max(0, seatCapacity - enrolledCount)} seats left
              </span>
            </div>

            {/* Right side: Border-only Register Now Button (Charcoal in normal, Green on hover) */}
            <button
              onClick={() => onRegister && onRegister(summit)}
              className="px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-transparent border-2 border-slate-800 text-slate-800 font-bold text-xs tracking-wide hover:border-emerald-600 hover:text-emerald-600 transition-all duration-200 flex items-center justify-center gap-1.5 group/btn cursor-pointer shrink-0"
            >
              <span className="font-bold whitespace-nowrap">Register Now</span>
              <ArrowRight size={15} className="transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProgramCard;
