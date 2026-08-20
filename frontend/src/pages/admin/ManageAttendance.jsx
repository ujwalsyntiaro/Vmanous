import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Search,
  Building2,
  CheckCircle2,
  XCircle,
  Users,
  Filter,
  RefreshCw,
  Award,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { getStudents, updateStudentAttendance } from '../../services/studentService';
import { getApplications } from '../../services/applicationService';
import { getColleges } from '../../services/collegeService';

const ManageAttendance = () => {
  const [students, setStudents] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All'); // All, Day1, Day2
  const [isCollegeOpen, setIsCollegeOpen] = useState(false);

  const collegeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(event.target)) {
        setIsCollegeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = () => {
    const rawStudents = getStudents();
    const rawApps = getApplications().filter(a => a.paymentStatus === 'Paid');

    const combinedMap = new Map();
    rawStudents.forEach(s => combinedMap.set((s.email || s.id).toLowerCase(), s));
    rawApps.forEach(a => {
      const key = (a.email || a.id).toLowerCase();
      if (!combinedMap.has(key)) {
        combinedMap.set(key, {
          id: a.id,
          studentName: a.studentName,
          email: a.email,
          phone: a.phone,
          collegeName: a.collegeName,
          programTitle: a.programTitle,
          passCode: a.passCode || 'PASS-VERIFIED',
          attendance: { day1: true, day2: false }
        });
      }
    });

    setStudents(Array.from(combinedMap.values()));
    setColleges(getColleges());
  };

  const handleToggleAttendance = (id, day) => {
    const target = students.find(s => s.id === id);
    if (!target) return;
    const currentVal = target.attendance?.[day] || false;
    const newVal = !currentVal;

    const updatedStudents = students.map(s => {
      if (s.id === id) {
        return {
          ...s,
          attendance: {
            ...(s.attendance || { day1: false, day2: false }),
            [day]: newVal
          }
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    updateStudentAttendance(id, day, newVal);
  };

  const filteredStudents = students.filter((stu) => {
    if (selectedCollege !== 'All' && stu.collegeName !== selectedCollege) {
      return false;
    }
    if (selectedDay === 'Day1' && !stu.attendance?.day1) return false;
    if (selectedDay === 'Day2' && !stu.attendance?.day2) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        stu.studentName?.toLowerCase().includes(q) ||
        stu.email?.toLowerCase().includes(q) ||
        stu.collegeName?.toLowerCase().includes(q) ||
        stu.passCode?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const day1PresentCount = students.filter(s => s.attendance?.day1).length;
  const day2PresentCount = students.filter(s => s.attendance?.day2).length;
  const day1Pct = students.length ? Math.round((day1PresentCount / students.length) * 100) : 0;
  const day2Pct = students.length ? Math.round((day2PresentCount / students.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="text-[#2D73B4]" />
            Student Attendance Tracker
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track Day 1 & Day 2 workshop attendance, verify student pass codes, and generate attendance stats.
          </p>
        </div>
        <button
          onClick={loadAttendanceData}
          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
        >
          <RefreshCw size={16} />
          Refresh Roster
        </button>
      </div>

      {/* Attendance Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#2D73B4] rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{students.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day 1 Attendance</p>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {day1PresentCount} <span className="text-xs font-semibold text-emerald-600">({day1Pct}%)</span>
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day 2 Attendance</p>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {day2PresentCount} <span className="text-xs font-semibold text-indigo-600">({day2Pct}%)</span>
            </h3>
          </div>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Day Filter Buttons (Black & White Design, Green Text on Hover & Select) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDay('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              selectedDay === 'All'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-400 font-extrabold shadow-xs'
                : 'bg-white text-slate-700 border-gray-200 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            All Days
          </button>
          <button
            onClick={() => setSelectedDay('Day1')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              selectedDay === 'Day1'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-400 font-extrabold shadow-xs'
                : 'bg-white text-slate-700 border-gray-200 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            Day 1 Present
          </button>
          <button
            onClick={() => setSelectedDay('Day2')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              selectedDay === 'Day2'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-400 font-extrabold shadow-xs'
                : 'bg-white text-slate-700 border-gray-200 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50/40'
            }`}
          >
            Day 2 Present
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Custom Partner College Selector Floating Dropdown (No OS Blue Highlight & Green Text on Hover/Select) */}
          <div className="relative flex-1 md:w-64" ref={collegeDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCollegeOpen(!isCollegeOpen)}
              className="relative w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer transition-all text-left hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/30"
            >
              <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <span className="block truncate pr-2">{selectedCollege === 'All' ? 'All Partner Colleges' : selectedCollege}</span>
              <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${isCollegeOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCollegeOpen && (
              <div className="absolute left-0 right-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 space-y-0.5 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => { setSelectedCollege('All'); setIsCollegeOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer ${
                    selectedCollege === 'All' ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-600'
                  }`}
                >
                  All Partner Colleges
                </button>
                {colleges.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => { setSelectedCollege(col.name); setIsCollegeOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold transition-colors cursor-pointer truncate ${
                      selectedCollege === col.name ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'text-slate-700 hover:bg-emerald-50/50 hover:text-emerald-600'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student, email, pass..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Student Info</th>
                <th className="py-3.5 px-4">College Institution</th>
                <th className="py-3.5 px-4">Pass Code</th>
                <th className="py-3.5 px-4 text-center">Day 1 Attendance</th>
                <th className="py-3.5 px-4 text-center">Day 2 Attendance</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    No attendance records match your selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu, index) => {
                  const isDay1 = stu.attendance?.day1;
                  const isDay2 = stu.attendance?.day2;

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-400">{index + 1}</td>
                      
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800 text-sm">{stu.studentName}</p>
                        <p className="text-[11px] text-slate-500">{stu.email}</p>
                      </td>

                      {/* College */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 line-clamp-1">{stu.collegeName}</p>
                        <p className="text-[11px] text-slate-500">{stu.programTitle}</p>
                      </td>

                      {/* Pass Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#2D73B4]">
                        {stu.passCode || 'PASS-VERIFIED'}
                      </td>

                      {/* Day 1 Checkbox Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAttendance(stu.id, 'day1')}
                          className={`text-xs font-semibold transition-colors cursor-pointer ${
                            isDay1
                              ? 'text-slate-900 font-bold hover:text-emerald-600'
                              : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {isDay1 ? 'Day 1 Present' : 'Absent'}
                        </button>
                      </td>

                      {/* Day 2 Checkbox Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAttendance(stu.id, 'day2')}
                          className={`text-xs font-semibold transition-colors cursor-pointer ${
                            isDay2
                              ? 'text-slate-900 font-bold hover:text-emerald-600'
                              : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {isDay2 ? 'Day 2 Present' : 'Absent'}
                        </button>
                      </td>

                      {/* Overall Status Text */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`text-xs font-semibold ${isDay1 || isDay2 ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                          {isDay1 && isDay2 ? '100% Attended' : isDay1 || isDay2 ? '50% Attended' : 'Absent'}
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageAttendance;
