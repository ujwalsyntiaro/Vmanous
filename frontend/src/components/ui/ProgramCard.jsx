import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, CheckCircle2, ArrowRight, Edit2, Trash2, MapPin, Clock, Users, Key } from 'lucide-react';
import { isSummitActive, isSummitVisiblePublicly, isRegistrationUpcoming } from '../../services/summitService';

const ProgramCard = ({ summit, index = 0, isAdmin = false, isHistory = false, onRegister, onEdit, onDelete, onViewStudents }) => {
  if (!isAdmin && !isSummitVisiblePublicly(summit)) {
    return null;
  }

  const isUpcomingRegistration = isRegistrationUpcoming(summit);

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
      transition={{ delay: index * 0.1, duration: 0.35 }}
      className="bg-white rounded-lg border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_6px_16px_rgba(15,23,42,0.04)] p-3.5 sm:p-4 flex flex-col relative overflow-hidden transition-all duration-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:border-slate-300 group h-full"
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

      <div className="flex-1 relative z-10 flex flex-col">
        {/* Event Type & Status Badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {summit.type || 'Flagship Event'}
          </span>
          <div className="flex flex-col items-end gap-1">
            {isAdmin && isUpcomingRegistration && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs">
                Scheduled (Starts Soon)
              </span>
            )}
            {(summit.status || isFull) && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs ${isCompleted
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : isClosed
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : summit.status === 'Filling Fast'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200/80'
                }`}>
                {displayStatus}
              </span>
            )}
            {summit.seatCapacity ? (
              <span className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-xs">
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] tracking-wide uppercase shadow-xs">
            <Building2 size={13} className="text-emerald-600 flex-shrink-0" />
            <span>{summit.college}</span>
          </div>

          {summit.address && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200/80 font-medium text-[11px] shadow-xs">
              <MapPin size={13} className="text-emerald-600 flex-shrink-0" />
              <span className="truncate max-w-[200px]">{summit.address}</span>
            </div>
          )}

          {isAdmin && summit.entryCode && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[11px] shadow-xs" title="Entry Code required by students">
              <Key size={12} className="text-amber-600 flex-shrink-0" />
              <span>Code: {summit.entryCode}</span>
            </div>
          )}
        </div>

        {/* Schedule & Timing Box */}
        <div className="p-2.5 rounded-lg border border-slate-200/90 bg-white mb-2 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-md bg-emerald-600 text-white shadow-xs shrink-0">
                <Calendar size={13} />
              </div>
              <span className="text-xs font-bold text-slate-900 tracking-tight truncate">{summit.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] sm:text-xs flex items-center gap-1 whitespace-nowrap">
                <span className="text-slate-500 font-medium text-[10px] sm:text-[11px] hidden sm:inline-block">Summit Date:</span>
                <span className="text-slate-500 font-medium text-[10px] sm:text-[11px] sm:hidden">Date:</span>
                <span className="text-slate-900 font-bold">
                  {(() => {
                    const str = summit.date;
                    if (!str) return '';
                    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
                      return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    }
                    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
                      const p = str.split('/');
                      return new Date(`${p[2]}-${p[1]}-${p[0]}`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    }
                    return str;
                  })()}
                </span>
              </span>
            </div>
          </div>

          {(summit.time || totalHours) && (
            <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 text-[11px] font-medium text-slate-600">
              {summit.time && (
                <div className="flex items-center gap-1.5">
                  <Clock size={12.5} className="text-emerald-600 flex-shrink-0" />
                  <span>{summit.time}</span>
                </div>
              )}
              {totalHours && (
                <span className="text-[10px] font-semibold text-slate-500 ml-auto">
                  {totalHours} Hours Total
                </span>
              )}
            </div>
          )}

          {(summit.startDate || summit.endDate) && (
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100 text-[11px] font-medium text-slate-600">
              <span className="text-slate-500 font-medium">Registration:</span>
              <span className="truncate text-slate-800 font-semibold">
                {(() => {
                  const formatD = (str) => {
                    if (!str) return '';
                    let d = new Date(str);
                    if (isNaN(d)) {
                      const p = str.split(/[-/]/);
                      if (p.length === 3) d = new Date(`${p[2]}-${p[1]}-${p[0]}`);
                    }
                    if (isNaN(d)) return str;
                    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                  };
                  const start = formatD(summit.startDate);
                  const end = formatD(summit.endDate);
                  return `${start} ${end ? `- ${end}` : ''}`;
                })()}
              </span>
            </div>
          )}
        </div>

        {/* Subtitle / Objective */}
        {summit.subtitle && (
          <p className="text-xs font-medium text-slate-600 leading-relaxed mb-1.5">
            {summit.subtitle}
          </p>
        )}

        {/* Features List (rendered only if present) */}
        {Array.isArray(summit.features) && summit.features.length > 0 && (
          <div className="mt-auto pt-2 border-t border-slate-100 space-y-1 mb-2.5">
            {summit.features.slice(0, 2).map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <CheckCircle2 size={13.5} className="text-emerald-600 flex-shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Admin Actions vs Student CTA */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
        {isAdmin ? (
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 w-full">
            {onEdit && !isHistory && (
              <button
                onClick={() => onEdit(summit)}
                className="flex-1 h-[34px] px-4 bg-blue-50/90 border border-blue-200/90 text-[#2D73B4] font-bold rounded-lg hover:bg-blue-100/90 hover:border-blue-300 transition-all flex items-center justify-center gap-2 text-xs shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <Edit2 size={14} />
                Edit
              </button>
            )}
            {isHistory && onViewStudents && (
              <button
                onClick={() => onViewStudents(summit)}
                className="flex-1 h-[34px] px-3 bg-emerald-50/90 border border-emerald-200/90 text-emerald-700 font-bold rounded-lg hover:bg-emerald-100/90 hover:border-emerald-300 transition-all flex items-center justify-center gap-1.5 text-xs shadow-xs active:scale-[0.99] cursor-pointer"
                title="View Enrolled Student Registration List"
              >
                <Users size={14} />
                <span>Enrolled Student List ({enrolledCount})</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(summit.id)}
                className={`h-[34px] bg-rose-50/90 border border-rose-200/90 text-rose-600 font-bold rounded-lg hover:bg-rose-100/90 hover:border-rose-300 transition-all flex items-center justify-center gap-1.5 text-xs shadow-xs active:scale-[0.99] cursor-pointer ${!isHistory && !onEdit ? 'w-full px-4' : 'px-3.5'
                  }`}
                title="Delete Record"
              >
                <Trash2 size={14} />
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
                className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-transparent border border-slate-800 text-slate-800 font-bold text-xs tracking-wide hover:border-emerald-600 hover:text-emerald-600 transition-all duration-200 flex items-center justify-center gap-1.5 group/btn cursor-pointer shrink-0 shadow-xs"
              >
                <span className="font-bold whitespace-nowrap">Register Now</span>
                <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProgramCard;
