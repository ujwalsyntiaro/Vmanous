import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, CheckCircle2, ArrowRight, Edit2, Trash2, MapPin, Clock, Users } from 'lucide-react';
import { isSummitActive } from '../../services/summitService';

const ProgramCard = ({ summit, index = 0, isAdmin = false, isHistory = false, onRegister, onEdit, onDelete, onViewStudents }) => {
  if (!isAdmin && !isSummitActive(summit)) {
    return null;
  }

  const enrolledCount = (summit.enrolledCount !== undefined && summit.enrolledCount !== null)
    ? summit.enrolledCount
    : (Array.isArray(summit.applications)
      ? summit.applications.filter(a => a.paymentStatus === 'Paid' || !a.paymentStatus).length
      : 0);
  const seatCapacity = summit.seatCapacity !== undefined ? Number(summit.seatCapacity) : 100;
  const isCompleted = summit.status === 'Event Completed' || summit.status === 'Completed';
  const isFull = enrolledCount >= seatCapacity;
  const isClosed = summit.status === 'Closed' || isFull;
  const displayStatus = isCompleted
    ? summit.status
    : (isClosed ? 'Registration Closed' : (summit.status === 'Filling Fast' ? 'Filling Fast' : 'Registration Open'));

  const totalHours = (summit.totalHours !== undefined && summit.totalHours !== null)
    ? String(summit.totalHours).trim()
    : (summit.duration && String(summit.duration).match(/(\d+)\s*(?:hrs|hours)/i)?.[1] || '');

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
            {(summit.status || isFull) && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                isCompleted
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : isClosed
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : summit.status === 'Filling Fast'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200/60'
              }`}>
                {displayStatus}
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
        <div className="p-2 rounded-md bg-slate-50 border border-slate-200/60 mb-2 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="p-1 rounded-md bg-emerald-600 text-white shadow-2xs shrink-0">
                <Calendar size={13} />
              </div>
              <span className="text-xs font-extrabold text-slate-900 tracking-tight">{summit.duration}</span>
              {totalHours && (
                <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-200/80 shadow-2xs">
                  {totalHours} Hrs
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs">
                {summit.date}
              </span>
            </div>
          </div>

          {(summit.time || totalHours) && (
            <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-200/50 text-[11px] font-semibold text-slate-600">
              {summit.time && (
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-emerald-600 flex-shrink-0" />
                  <span>{summit.time}</span>
                </div>
              )}
              {totalHours && (
                <span className="text-[10px] font-bold text-slate-500 ml-auto">
                  {totalHours} Hours Total
                </span>
              )}
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
        {Array.isArray(summit.features) && summit.features.length > 0 && (
          <div className="mt-auto pt-2 border-t border-slate-100 space-y-1 mb-3">
            {summit.features.slice(0, 2).map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Admin Actions vs Student CTA */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
        {isAdmin ? (
          <div className="flex items-center justify-end gap-2 sm:gap-3 w-full">
            {onEdit && !isHistory && (
              <button
                onClick={() => onEdit(summit)}
                className="flex-1 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 font-semibold rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Edit2 size={15} />
                Edit
              </button>
            )}
            {isHistory && onViewStudents && (
              <button
                onClick={() => onViewStudents(summit)}
                className="flex-1 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-md hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                title="View Enrolled Student Registration List"
              >
                <Users size={15} />
                <span>Enrolled Student List ({enrolledCount})</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(summit.id)}
                className={`py-2 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-md hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer ${
                  !isHistory && !onEdit ? 'w-full px-4' : 'px-3'
                }`}
                title="Delete Record"
              >
                <Trash2 size={15} />
                {!isHistory ? '' : ''}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Left side: Only Seats Left */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isClosed ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-xs sm:text-sm font-bold text-slate-700 truncate">
                {Math.max(0, seatCapacity - enrolledCount)} seats left
              </span>
            </div>

            {/* Right side: Register Now Button vs Closed Button */}
            {isClosed ? (
              <button
                disabled
                className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-400 font-bold text-xs tracking-wide cursor-not-allowed opacity-80 flex items-center justify-center gap-1.5 shrink-0 select-none"
              >
                <span className="font-bold whitespace-nowrap">Registration Closed</span>
              </button>
            ) : (
              <button
                onClick={() => onRegister && onRegister(summit)}
                className="px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-transparent border border-slate-800 text-slate-800 font-bold text-xs tracking-wide hover:border-emerald-600 hover:text-emerald-600 transition-all duration-200 flex items-center justify-center gap-1.5 group/btn cursor-pointer shrink-0"
              >
                <span className="font-bold whitespace-nowrap">Register Now</span>
                <ArrowRight size={15} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProgramCard;
