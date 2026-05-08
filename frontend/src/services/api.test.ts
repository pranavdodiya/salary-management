import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getOverallInsights,
  getInsightsByCountry,
  getInsightsByJobTitle,
  getCountries,
  getJobTitles,
} from './api';

// eslint-disable-next-line no-var
var mockGet: jest.Mock;
// eslint-disable-next-line no-var
var mockPost: jest.Mock;
// eslint-disable-next-line no-var
var mockPut: jest.Mock;
// eslint-disable-next-line no-var
var mockDel: jest.Mock;

jest.mock('axios', () => {
  mockGet = jest.fn();
  mockPost = jest.fn();
  mockPut = jest.fn();
  mockDel = jest.fn();
  const instance = {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDel,
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => instance),
    },
  };
});

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getEmployees fetches employees with params', async () => {
    const mockResponse = {
      data: {
        data: [{ id: 1, full_name: 'John Doe' }],
        meta: { total_count: 1, page: 1, per_page: 10, total_pages: 1 },
      },
    };
    mockGet.mockResolvedValue(mockResponse);

    const result = await getEmployees({ page: 1, per_page: 10 });
    expect(mockGet).toHaveBeenCalledWith('/employees', {
      params: { page: 1, per_page: 10 },
    });
    expect(result).toEqual(mockResponse.data);
  });

  test('getEmployees with filters', async () => {
    const mockResponse = {
      data: {
        data: [],
        meta: { total_count: 0, page: 1, per_page: 10, total_pages: 0 },
      },
    };
    mockGet.mockResolvedValue(mockResponse);

    await getEmployees({ page: 1, per_page: 10, country: 'USA', job_title: 'Engineer' });
    expect(mockGet).toHaveBeenCalledWith('/employees', {
      params: { page: 1, per_page: 10, country: 'USA', job_title: 'Engineer' },
    });
  });

  test('createEmployee posts new employee', async () => {
    const employeeData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      job_title: 'Engineer',
      department: 'Engineering',
      country: 'USA',
      salary: 100000,
      date_of_joining: '2024-01-01',
    };
    const mockResponse = { data: { id: 1, ...employeeData, full_name: 'John Doe' } };
    mockPost.mockResolvedValue(mockResponse);

    const result = await createEmployee(employeeData);
    expect(mockPost).toHaveBeenCalledWith('/employees', {
      employee: employeeData,
    });
    expect(result).toEqual(mockResponse.data);
  });

  test('updateEmployee puts updated employee', async () => {
    const employeeData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      job_title: 'Senior Engineer',
      department: 'Engineering',
      country: 'USA',
      salary: 120000,
      date_of_joining: '2024-01-01',
    };
    const mockResponse = { data: { id: 1, ...employeeData } };
    mockPut.mockResolvedValue(mockResponse);

    const result = await updateEmployee(1, employeeData);
    expect(mockPut).toHaveBeenCalledWith('/employees/1', {
      employee: employeeData,
    });
    expect(result).toEqual(mockResponse.data);
  });

  test('deleteEmployee deletes employee', async () => {
    mockDel.mockResolvedValue({});

    await deleteEmployee(1);
    expect(mockDel).toHaveBeenCalledWith('/employees/1');
  });

  test('getOverallInsights fetches overall insights', async () => {
    const mockResponse = {
      data: {
        overall: {
          min_salary: 30000,
          max_salary: 200000,
          average_salary: 85000,
          median_salary: 80000,
          total_employees: 100,
        },
      },
    };
    mockGet.mockResolvedValue(mockResponse);

    const result = await getOverallInsights();
    expect(mockGet).toHaveBeenCalledWith('/salary_insights');
    expect(result).toEqual(mockResponse.data);
  });

  test('getInsightsByCountry fetches country insights', async () => {
    const mockResponse = {
      data: { data: [{ country: 'USA', average_salary: 90000, employee_count: 50 }] },
    };
    mockGet.mockResolvedValue(mockResponse);

    const result = await getInsightsByCountry('USA');
    expect(mockGet).toHaveBeenCalledWith('/salary_insights/by_country', {
      params: { country: 'USA' },
    });
    expect(result).toEqual(mockResponse.data);
  });

  test('getInsightsByJobTitle fetches job title insights', async () => {
    const mockResponse = {
      data: { data: [{ job_title: 'Engineer', average_salary: 95000 }] },
    };
    mockGet.mockResolvedValue(mockResponse);

    const result = await getInsightsByJobTitle();
    expect(mockGet).toHaveBeenCalledWith('/salary_insights/by_job_title', {
      params: {},
    });
    expect(result).toEqual(mockResponse.data);
  });

  test('getCountries fetches country list', async () => {
    const mockResponse = { data: { data: ['USA', 'UK', 'Canada'] } };
    mockGet.mockResolvedValue(mockResponse);

    const result = await getCountries();
    expect(mockGet).toHaveBeenCalledWith('/salary_insights/countries');
    expect(result).toEqual(mockResponse.data);
  });

  test('getJobTitles fetches job title list', async () => {
    const mockResponse = { data: { data: ['Engineer', 'Manager', 'Designer'] } };
    mockGet.mockResolvedValue(mockResponse);

    const result = await getJobTitles();
    expect(mockGet).toHaveBeenCalledWith('/salary_insights/job_titles');
    expect(result).toEqual(mockResponse.data);
  });
});
