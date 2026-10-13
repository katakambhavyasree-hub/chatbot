export interface Institution {
  name: string;
  short_name: string;
  placeholder_note?: string;
  established_year: number;
  code: string;
  accreditation: string;
  campus_address: string;
  motto: string;
  campus_size: string;
  working_hours: string;
  official_website: string;
  admissions_portal: string;
  student_portal: string;
}

export interface Admissions {
  academic_year: string;
  eligibility_ug: {
    general_rule: string;
    minimum_marks: string;
    accepted_entrance_exams: string[];
  };
  eligibility_pg: {
    general_rule: string;
    minimum_marks: string;
    accepted_entrance_exams: string[];
  };
  application_steps: string[];
  important_dates: Record<string, string>;
  reservation_policy: string;
}

export interface Course {
  code: string;
  degree: string;
  department: string;
  duration_years: number;
  total_seats: number;
  description: string;
  key_subjects: string[];
}

export interface FeeItem {
  course: string;
  tuition_fee_per_year: string;
  development_fee_per_year: string;
  total_annual_academic_fee: string;
}

export interface FeeStructure {
  currency: string;
  payment_mode: string;
  annual_tuition_fees: FeeItem[];
  one_time_fees_at_admission: Record<string, string>;
  hostel_and_mess_fees: Record<string, string>;
  transport_bus_fee: string;
  fee_payment_schedule: string;
  fee_refund_policy: string;
}

export interface DepartmentHead {
  department: string;
  head_of_department: string;
  experience: string;
  specialization: string;
  email: string;
}

export interface Faculty {
  total_faculty_members: number;
  faculty_student_ratio: string;
  phd_qualified_percentage: string;
  department_heads: DepartmentHead[];
}

export interface GradeItem {
  grade: string;
  grade_points: number;
  marks_range: string;
}

export interface Examinations {
  curriculum_structure: string;
  attendance_requirement: string;
  evaluation_breakdown: Record<string, string>;
  grading_scale: GradeItem[];
  passing_criteria: string;
  backlog_and_revaluation_rules: string;
  tentative_exam_schedules: Record<string, string>;
}

export interface Placements {
  placement_season: string;
  overall_placement_rate: string;
  highest_salary_package: string;
  average_salary_package: string;
  median_salary_package: string;
  total_companies_visited: string;
  top_recruiters: string[];
  internship_opportunities: string;
  training_cell_initiatives: string;
}

export interface Scholarship {
  name: string;
  benefit: string;
  eligibility: string;
}

export interface Facilities {
  library: {
    name: string;
    volumes: string;
    digital_resources: string;
    operating_hours: string;
    facilities: string;
  };
  laboratories: {
    key_labs: string[];
  };
  hostel: {
    capacity: string;
    amenities: string;
    curfew_rules: string;
  };
  transport: {
    fleet_size: string;
    coverage: string;
    tracking: string;
  };
  sports_and_recreation: {
    facilities: string;
  };
  cafeteria_and_medical: {
    cafeteria: string;
    health_centre: string;
  };
}

export interface ContactsDirectory {
  admissions_helpdesk: Record<string, string>;
  examinations_office: Record<string, string>;
  accounts_and_fees: Record<string, string>;
  training_and_placement_cell: Record<string, string>;
  hostel_wardens: Record<string, string>;
  student_grievance_and_helpline: Record<string, string>;
  quick_links: Array<{ title: string; url: string }>;
}

export interface CollegeData {
  institution?: Institution;
  admissions?: Admissions;
  courses?: Course[];
  fee_structure?: FeeStructure;
  faculty?: Faculty;
  examinations_and_academics?: Examinations;
  placements_and_internships?: Placements;
  scholarships?: Scholarship[];
  facilities?: Facilities;
  contacts_and_directory?: ContactsDirectory;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sources?: string[];
  isError?: boolean;
}
