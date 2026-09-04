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
  ChevronDown,
} from "lucide-react";
import { fetchStudentsAsync, deleteStudent } from "../../services/studentService";

const ManageStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("All");

  useEffect(() => {
    loadStudentsData();
    window.addEventListener("applications_updated", loadStudentsData);
    window.addEventListener("summits_updated", loadStudentsData);
    return () => {
      window.removeEventListener("applications_updated", loadStudentsData);
      window.removeEventListener("summits_updated", loadStudentsData);
    };
  }, []);

  const loadStudentsData = async () => {
    try {
      const unique = await fetchStudentsAsync();
      setStudents(unique || []);
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this student from the roster?",
      )
    ) {
      await deleteStudent(id);
      await loadStudentsData();
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
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none"
          />
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-[#2D73B4]/20 focus:border-[#2D73B4] cursor-pointer transition-all shadow-2xs hover:bg-white"
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
          <ChevronDown
            size={14}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
          />
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
                          onClick={() => {
                            const nameParts = (stu.studentName || "").trim().split(" ");
                            const fName = nameParts[0] || "Student";
                            const lName = nameParts.slice(1).join(" ") || "";
                            navigate("/pass", {
                              state: {
                                formData: {
                                  firstName: fName,
                                  lastName: lName,
                                  fullName: stu.studentName,
                                  email: stu.email,
                                  phone: stu.phone || "N/A",
                                  bloodGroup: stu.bloodGroup || "O+",
                                  institution: stu.collegeName,
                                  collegeAddress: stu.venueLocation || "Main Campus Auditorium",
                                  programInterest: stu.programTitle || "AI Summit Workshop 2026",
                                  degree: stu.degree || "B.Tech",
                                  branch: stu.branch || "Computer Science",
                                  semester: stu.year || "3rd Year",
                                  selfie: stu.selfiePhotoUrl,
                                  selfiePhotoUrl: stu.selfiePhotoUrl,
                                  tenthPercentage: stu.marksTenth || "85",
                                  twelfthPercentage: stu.marksTwelfth || "83",
                                  appliedDate: stu.createdAt || stu.enrolledAt,
                                  paymentStatus: "Paid",
                                  amountPaid: stu.amountPaid !== undefined && stu.amountPaid !== null ? Number(stu.amountPaid) : 0,
                                  baseAmount: stu.baseAmount !== undefined && stu.baseAmount !== null ? Number(stu.baseAmount) : null,
                                  gstAmount: stu.gstAmount !== undefined && stu.gstAmount !== null ? Number(stu.gstAmount) : null,
                                  platformFee: stu.platformFee !== undefined && stu.platformFee !== null ? Number(stu.platformFee) : 0,
                                  summitId: stu.summitId || null,
                                  transactionId: stu.transactionId || stu.passCode || "PASS-VERIFIED",
                                  passCode: stu.passCode || "PASS-VERIFIED",
                                },
                                paymentId: stu.passCode || stu.transactionId || "PASS-VERIFIED",
                                passCode: stu.passCode || "PASS-VERIFIED",
                              },
                            });
                          }}
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
