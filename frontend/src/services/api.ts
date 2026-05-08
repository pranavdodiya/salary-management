import axios from 'axios';
import {
  Employee,
  EmployeeFormData,
  PaginatedResponse,
  OverallInsights,
  CountryInsight,
  JobTitleInsight,
  DepartmentInsight,
  SalaryRange,
  CountryPayroll,
} from '../types/employee';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EmployeeParams {
  page?: number;
  per_page?: number;
  country?: string;
  job_title?: string;
  department?: string;
  search?: string;
  sort_by?: string;
  sort_direction?: string;
}

export const getEmployees = async (params?: EmployeeParams): Promise<PaginatedResponse<Employee>> => {
  const response = await api.get('/employees', { params });
  return response.data;
};

export const getEmployee = async (id: number): Promise<Employee> => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (data: EmployeeFormData): Promise<Employee> => {
  const response = await api.post('/employees', { employee: data });
  return response.data;
};

export const updateEmployee = async (id: number, data: EmployeeFormData): Promise<Employee> => {
  const response = await api.put(`/employees/${id}`, { employee: data });
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/employees/${id}`);
};

export const getOverallInsights = async (): Promise<{ overall: OverallInsights }> => {
  const response = await api.get('/salary_insights');
  return response.data;
};

export const getInsightsByCountry = async (country?: string): Promise<{ data: CountryInsight[] }> => {
  const response = await api.get('/salary_insights/by_country', { params: country ? { country } : {} });
  return response.data;
};

export const getInsightsByJobTitle = async (country?: string): Promise<{ data: JobTitleInsight[] }> => {
  const response = await api.get('/salary_insights/by_job_title', { params: country ? { country } : {} });
  return response.data;
};

export const getInsightsByDepartment = async (): Promise<{ data: DepartmentInsight[] }> => {
  const response = await api.get('/salary_insights/by_department');
  return response.data;
};

export const getSalaryRanges = async (): Promise<{ data: SalaryRange[] }> => {
  const response = await api.get('/salary_insights/salary_ranges');
  return response.data;
};

export const getTopEarners = async (limit?: number): Promise<{ data: Employee[] }> => {
  const response = await api.get('/salary_insights/top_earners', { params: limit ? { limit } : {} });
  return response.data;
};

export const getCountryPayroll = async (): Promise<{ data: CountryPayroll[] }> => {
  const response = await api.get('/salary_insights/country_payroll');
  return response.data;
};

export const getCountries = async (): Promise<{ data: string[] }> => {
  const response = await api.get('/salary_insights/countries');
  return response.data;
};

export const getJobTitles = async (): Promise<{ data: string[] }> => {
  const response = await api.get('/salary_insights/job_titles');
  return response.data;
};

export const getDepartments = async (): Promise<{ data: string[] }> => {
  const response = await api.get('/salary_insights/departments');
  return response.data;
};

export const exportEmployeesCsv = async (params?: EmployeeParams): Promise<Blob> => {
  const response = await api.get('/exports/employees', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

export default api;
