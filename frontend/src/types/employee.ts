export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  job_title: string;
  country: string;
  salary: number;
  department: string;
  date_of_joining: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  job_title: string;
  country: string;
  salary: number;
  department: string;
  date_of_joining: string;
  email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total_count: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface OverallInsights {
  min_salary: number;
  max_salary: number;
  average_salary: number;
  median_salary: number;
  total_employees: number;
}

export interface CountryInsight {
  country: string;
  min_salary: number;
  max_salary: number;
  average_salary: number;
  employee_count: number;
}

export interface JobTitleInsight {
  job_title: string;
  average_salary: number;
  min_salary: number;
  max_salary: number;
  employee_count: number;
}

export interface DepartmentInsight {
  department: string;
  average_salary: number;
  min_salary: number;
  max_salary: number;
  employee_count: number;
}

export interface SalaryRange {
  range: string;
  count: number;
}

export interface CountryPayroll {
  country: string;
  total_payroll: number;
  employee_count: number;
  average_salary: number;
}
