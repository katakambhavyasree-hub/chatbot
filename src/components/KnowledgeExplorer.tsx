import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  GraduationCap,
  CreditCard,
  Users,
  Award,
  Building,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  X,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { CollegeData } from '../types';

interface KnowledgeExplorerProps {
  collegeData: CollegeData;
  onAskQuestion: (question: string) => void;
}

type CategoryType =
  | 'all'
  | 'admissions'
  | 'courses'
  | 'fees'
  | 'faculty'
  | 'exams'
  | 'placements'
  | 'scholarships'
  | 'facilities'
  | 'contacts';

export const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({
  collegeData,
  onAskQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const institution = collegeData.institution;
  const admissions = collegeData.admissions;
  const courses = collegeData.courses || [];
  const fees = collegeData.fee_structure;
  const faculty = collegeData.faculty;
  const exams = collegeData.examinations_and_academics;
  const placements = collegeData.placements_and_internships;
  const scholarships = collegeData.scholarships || [];
  const facilities = collegeData.facilities;
  const contacts = collegeData.contacts_and_directory;

  const categories: Array<{ id: CategoryType; label: string; icon: React.ElementType }> = [
    { id: 'all', label: 'All Records', icon: BookOpen },
    { id: 'admissions', label: 'Admissions', icon: GraduationCap },
    { id: 'courses', label: 'Courses & Degrees', icon: BookOpen },
    { id: 'fees', label: 'Fee Structure', icon: CreditCard },
    { id: 'faculty', label: 'Faculty & HODs', icon: Users },
    { id: 'exams', label: 'Exams & Rules', icon: Award },
    { id: 'placements', label: 'Placements', icon: Award },
    { id: 'scholarships', label: 'Scholarships', icon: Award },
    { id: 'facilities', label: 'Hostel & Facilities', icon: Building },
    { id: 'contacts', label: 'Office Directory', icon: Phone },
  ];

  const term = searchTerm.toLowerCase().trim();

  // Helper matching functions
  const matchesCourse = (c: any) =>
    !term ||
    c.degree?.toLowerCase().includes(term) ||
    c.department?.toLowerCase().includes(term) ||
    c.code?.toLowerCase().includes(term) ||
    c.key_subjects?.some((s: string) => s.toLowerCase().includes(term));

  const matchesFee = (f: any) =>
    !term ||
    f.course?.toLowerCase().includes(term) ||
    f.total_annual_academic_fee?.toLowerCase().includes(term);

  const matchesFaculty = (f: any) =>
    !term ||
    f.head_of_department?.toLowerCase().includes(term) ||
    f.department?.toLowerCase().includes(term) ||
    f.specialization?.toLowerCase().includes(term);

  const matchesScholarship = (s: any) =>
    !term ||
    s.name?.toLowerCase().includes(term) ||
    s.benefit?.toLowerCase().includes(term) ||
    s.eligibility?.toLowerCase().includes(term);

  const filteredCourses = courses.filter(matchesCourse);
  const filteredFees = fees?.annual_tuition_fees?.filter(matchesFee) || [];
  const filteredFaculty = faculty?.department_heads?.filter(matchesFaculty) || [];
  const filteredScholarships = scholarships.filter(matchesScholarship);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Directory Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Institutional Records</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Campus Knowledge Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse official degree programs, annual tuition, admission deadlines, and campus guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
              {institution?.name || 'College Records'}
            </span>
          </div>
        </div>

        {/* Enhanced Search Input */}
        <div className="mt-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs, fee structures, faculty, hostels, cutoffs, or policies..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills / Segmented Controls */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Grid Sections */}
      <div className="space-y-8">
        {/* 1. COURSES & DEGREES */}
        {(activeCategory === 'all' || activeCategory === 'courses') && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Academic Programs & Departments</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">{filteredCourses.length} Programs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
                      <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {course.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span>{course.duration_years} Years</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-medium text-slate-700">{course.total_seats} Seats</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {course.degree} in {course.department}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Key Subjects */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-500">Core Subjects:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {course.key_subjects?.slice(0, 4).map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onAskQuestion(`What are the fees and admission criteria for ${course.degree} in ${course.department}?`)}
                    className="mt-4 flex items-center justify-between w-full px-3 py-2 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-950 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                  >
                    <span>Inquire via Chatbot</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. FEE STRUCTURE */}
        {(activeCategory === 'all' || activeCategory === 'fees') && fees && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Annual Tuition & Campus Fee Breakdown</span>
              </h2>
              <span className="text-xs text-slate-500">Payment: {fees.payment_mode}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Annual Tuition Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Academic Fee Schedules</h3>
                  <span className="text-xs text-slate-500">Annual</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredFees.map((fee, fIdx) => (
                    <div key={fIdx} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{fee.course}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tuition: {fee.tuition_fee_per_year} · Development: {fee.development_fee_per_year}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {fee.total_annual_academic_fee}
                        </span>
                        <span className="block text-[11px] text-slate-400">per year</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hostel, Deposits, Schedules */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Hostel & Living Expenses</h3>
                  <div className="space-y-2 text-xs">
                    {Object.entries(fees.hostel_and_mess_fees || {}).map(([key, val], idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                        <span className="capitalize text-slate-600">{key.replace(/_/g, ' ')}</span>
                        <span className="font-semibold text-slate-900 tabular-nums">{String(val)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-600">Campus Transport Bus</span>
                      <span className="font-semibold text-slate-900 tabular-nums">{fees.transport_bus_fee}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 mb-1">Fee Payment Schedule & Refunds</h4>
                  <p className="mb-2 leading-relaxed">{fees.fee_payment_schedule}</p>
                  <p className="text-slate-500">{fees.fee_refund_policy}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. ADMISSIONS PROCEDURE */}
        {(activeCategory === 'all' || activeCategory === 'admissions') && admissions && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <span>Admissions & Eligibility ({admissions.academic_year})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* UG Eligibility */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Undergraduate Eligibility</h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {admissions.eligibility_ug?.general_rule}
                </p>
                <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-900">Cutoff: </span>
                    {admissions.eligibility_ug?.minimum_marks}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Accepted Entrance: </span>
                    {admissions.eligibility_ug?.accepted_entrance_exams?.join(', ')}
                  </div>
                </div>
              </div>

              {/* Steps to Apply */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Application Steps</h3>
                <div className="space-y-2 text-xs text-slate-700">
                  {admissions.application_steps?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-amber-600 tabular-nums shrink-0">{idx + 1}.</span>
                      <span>{step.replace(/^Step \d+:\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Dates & Quota */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Important Deadlines</h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(admissions.important_dates || {}).map(([evt, date], idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                      <span className="capitalize text-slate-600">{evt.replace(/_/g, ' ')}</span>
                      <span className="font-semibold text-slate-900">{String(date)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  {admissions.reservation_policy}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. PLACEMENTS & CAREERS */}
        {(activeCategory === 'all' || activeCategory === 'placements') && placements && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Placements, Salaries & Industry Partners</span>
              </h2>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
              {/* Highlight Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500">Placement Success</span>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
                    {placements.overall_placement_rate}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Highest Salary Package</span>
                  <div className="text-2xl font-bold text-amber-600 tabular-nums mt-0.5">
                    {placements.highest_salary_package}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Average Salary CTC</span>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
                    {placements.average_salary_package}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Recruiting Companies</span>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
                    {placements.total_companies_visited}
                  </div>
                </div>
              </div>

              {/* Recruiters list */}
              <div className="mt-5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Top Recruiting Partners:
                </span>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {placements.top_recruiters?.map((recruiter, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors"
                    >
                      {recruiter}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-900">Internship Policy: </strong>
                  {placements.internship_opportunities}
                </p>
                <p>
                  <strong className="text-slate-900">Training Initiatives: </strong>
                  {placements.training_cell_initiatives}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 5. FACULTY & DEPARTMENT HEADS */}
        {(activeCategory === 'all' || activeCategory === 'faculty') && faculty && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Faculty Leadership & Department Heads</span>
              </h2>
              <span className="text-xs text-slate-500">
                Ratio: {faculty.faculty_student_ratio} · Ph.D. Qualified: {faculty.phd_qualified_percentage}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredFaculty.map((hod, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900">{hod.head_of_department}</h3>
                  <span className="text-xs font-medium text-amber-700 block mt-0.5">
                    {hod.department}
                  </span>
                  <div className="mt-2.5 text-xs text-slate-600 space-y-1">
                    <p>Experience: {hod.experience}</p>
                    <p>Research: {hod.specialization}</p>
                    <p className="text-[11px] font-mono text-slate-500 truncate pt-1">{hod.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. EXAMINATIONS & REGULATIONS */}
        {(activeCategory === 'all' || activeCategory === 'exams') && exams && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Academic Regulations & Examination Policy</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Attendance & Eligibility Rules</h3>
                  <p className="text-slate-700 mt-1 leading-relaxed">{exams.attendance_requirement}</p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900">Passing & Backlog Rules</h3>
                  <p className="text-slate-700 mt-1">{exams.passing_criteria}</p>
                  <p className="text-slate-500 mt-1">{exams.backlog_and_revaluation_rules}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Grading System (10-Point Scale)</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {exams.grading_scale?.map((g, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1.5">
                      <span className="font-semibold text-slate-800">{g.grade}</span>
                      <span className="text-slate-500 tabular-nums">{g.marks_range}</span>
                      <span className="font-bold text-amber-700 tabular-nums">{g.grade_points} Pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 7. SCHOLARSHIPS */}
        {(activeCategory === 'all' || activeCategory === 'scholarships') && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Scholarships & Financial Aid Grants</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScholarships.map((sch, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900">{sch.name}</h3>
                  <div className="mt-2.5 text-xs">
                    <span className="font-semibold text-emerald-800 block bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
                      {sch.benefit}
                    </span>
                    <p className="text-slate-600 leading-relaxed">{sch.eligibility}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. FACILITIES */}
        {(activeCategory === 'all' || activeCategory === 'facilities') && facilities && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-600" />
                <span>Campus Infrastructure & Facilities</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Library */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1">{facilities.library?.name}</h3>
                <p className="text-slate-600 font-semibold mb-2">{facilities.library?.volumes}</p>
                <p className="text-slate-700 mb-2">{facilities.library?.facilities}</p>
                <p className="text-slate-500">Hours: {facilities.library?.operating_hours}</p>
              </div>

              {/* Hostels */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Residential Hostels</h3>
                <p className="text-slate-700 mb-2">{facilities.hostel?.capacity}</p>
                <p className="text-slate-600 mb-2">{facilities.hostel?.amenities}</p>
                <div className="p-2.5 bg-amber-50 text-amber-900 rounded-md font-medium">
                  {facilities.hostel?.curfew_rules}
                </div>
              </div>

              {/* Transport & Health */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-1">Transport & Healthcare</h3>
                <p className="text-slate-700 mb-2">{facilities.transport?.fleet_size}</p>
                <p className="text-slate-600 mb-2">{facilities.transport?.coverage}</p>
                <div className="pt-2 border-t border-slate-100 text-slate-700">
                  <strong className="text-slate-900">Medical Clinic: </strong>
                  {facilities.cafeteria_and_medical?.health_centre}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 9. CONTACTS & DIRECTORY */}
        {(activeCategory === 'all' || activeCategory === 'contacts') && contacts && (
          <section>
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-200 pb-2">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Office Directory & Helplines</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(contacts).filter(([k]) => k !== 'quick_links').map(([key, item]: any, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-xs">
                  <h3 className="text-sm font-bold text-slate-900 capitalize mb-1">
                    {key.replace(/_/g, ' ')}
                  </h3>
                  <div className="space-y-1.5 text-slate-600 mt-2">
                    {item.phone && <p className="font-semibold text-slate-900">Phone: {item.phone}</p>}
                    {item.emergency_24x7 && <p className="font-semibold text-rose-600">Emergency: {item.emergency_24x7}</p>}
                    {item.email && <p className="font-mono text-slate-500">{item.email}</p>}
                    {item.office_location && <p>Location: {item.office_location}</p>}
                    {item.in_charge && <p className="text-slate-500">{item.in_charge}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
