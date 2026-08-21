import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Building2,
  CheckCircle2,
  ExternalLink,
  Trash2,
  RefreshCw,
  Award,
} from "lucide-react";
import { getStudents, deleteStudent } from "../../services/studentService";

const ManageStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("All");

  useEffect(() => {
    loadStudentsData();
  }, []);

  const loadStudentsData = async () => {
    try {
      const res = await fetch("/api/v1/students");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setStudents(
          json.data.map((s) => ({
            id: `stu_${s.id}`,
            studentName: s.name,
            email: s.email,
            phone: s.phone,
            collegeName: s.collegeName,
            programTitle: "AI SUMMIT WORKSHOP 2030",
            venueLocation: "Main Campus",
            branch: s.branch || "Computer Science & Engineering",
            year: s.year || "3rd Year",
            degree: "B.Tech",
            passCode: s.passCode || "PASS-VERIFIED",
            paymentStatus: "Paid",
          })),
        );
        return;
      }
    } catch (err) {
      console.log("Using local fallback for students:", err);
    }
    const rawStudents = getStudents();
    setStudents(rawStudents);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this student from the roster?",
      )
    ) {
      const updated = deleteStudent(id);
      setStudents(updated);
    }
  };

  // Get unique college names for dropdown filter
  const collegeList = Array.from(
    new Set(students.map((s) => s.collegeName).filter(Boolean)),
  );

  const filteredStudents = students.filter((stu) => {
    if (selectedCollege !== "All" && stu.collegeName !== selectedCollege) {
      return false;
    }
    if (searchQuery.trim() !== "") {
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Enrolled Students Roster
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            View confirmed paid registrations, digital passes, and attendance
            status by college.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* College Filter Dropdown */}
        <div className="relative w-full sm:w-72">
          <Building2
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4]"
          >
            <option value="All">
              All Colleges ({students.length} Enrolled)
            </option>
            {collegeList.map((colName) => {
              const count = students.filter(
                (s) => s.collegeName === colName,
              ).length;
              return (
                <option key={colName} value={colName}>
                  {colName} ({count} Students)
                </option>
              );
            })}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search student, email, pass..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4]"
          />
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">College Institution</th>
                <th className="py-3.5 px-4">Program & Branch</th>
                <th className="py-3.5 px-4">Digital Pass Code</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    No enrolled students found for the selected filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu, index) => (
                  <tr
                    key={stu.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-400">
                      {index + 1}
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 text-sm">
                        {stu.studentName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {stu.email} &bull; {stu.phone}
                      </p>
                    </td>

                    {/* College */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 line-clamp-1">
                        {stu.collegeName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {stu.venueLocation || "Main Campus"}
                      </p>
                    </td>

                    {/* Program */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">
                        {stu.programTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {stu.degree} &bull; {stu.branch}
                      </p>
                    </td>

                    {/* Digital Pass Code */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 size={13} />
                        {stu.passCode || "PASS-VERIFIED"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate("/pass", {
                              state: {
                                formData: {
                                  firstName: stu.studentName,
                                  email: stu.email,
                                  institution: stu.collegeName,
                                },
                              },
                            })
                          }
                          className="px-2.5 py-1.5 bg-blue-50 text-[#2D73B4] hover:bg-blue-100 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink size={14} />
                          Inspect Pass
                        </button>
                        <button
                          onClick={() => handleDelete(stu.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
