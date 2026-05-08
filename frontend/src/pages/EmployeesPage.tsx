import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Card,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getCountries,
  getJobTitles,
  getDepartments,
  exportEmployeesCsv,
} from '../services/api';
import { Employee, EmployeeFormData } from '../types/employee';
import EmployeeForm from '../components/EmployeeForm';

const { Title } = Typography;
const { Option } = Select;

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({
    country: '',
    job_title: '',
    department: '',
    search: '',
  });
  const [sorter, setSorter] = useState({ sort_by: '', sort_direction: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.current,
        per_page: pagination.pageSize,
      };
      if (filters.country) params.country = filters.country;
      if (filters.job_title) params.job_title = filters.job_title;
      if (filters.department) params.department = filters.department;
      if (filters.search) params.search = filters.search;
      if (sorter.sort_by) params.sort_by = sorter.sort_by;
      if (sorter.sort_direction) params.sort_direction = sorter.sort_direction;

      const response = await getEmployees(params);
      setEmployees(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.meta.total_count,
      }));
    } catch (error) {
      message.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters, sorter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [countriesRes, jobTitlesRes, departmentsRes] = await Promise.all([
          getCountries(),
          getJobTitles(),
          getDepartments(),
        ]);
        setCountries(countriesRes.data);
        setJobTitles(jobTitlesRes.data);
        setDepartments(departmentsRes.data);
      } catch (error) {
        // silently fail for filter options
      }
    };
    loadFilterOptions();
  }, []);

  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    _filters: any,
    sorterResult: SorterResult<Employee> | SorterResult<Employee>[]
  ) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 10,
    }));

    const singleSorter = Array.isArray(sorterResult) ? sorterResult[0] : sorterResult;
    if (singleSorter && singleSorter.field) {
      setSorter({
        sort_by: singleSorter.field as string,
        sort_direction: singleSorter.order === 'ascend' ? 'asc' : singleSorter.order === 'descend' ? 'desc' : '',
      });
    } else {
      setSorter({ sort_by: '', sort_direction: '' });
    }
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setModalVisible(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      message.error('Failed to delete employee');
    }
  };

  const handleFormSubmit = async (data: EmployeeFormData) => {
    setFormLoading(true);
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, data);
        message.success('Employee updated successfully');
      } else {
        await createEmployee(data);
        message.success('Employee created successfully');
      }
      setModalVisible(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      message.error('Failed to save employee');
    } finally {
      setFormLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const params: any = {};
      if (filters.country) params.country = filters.country;
      if (filters.job_title) params.job_title = filters.job_title;
      if (filters.department) params.department = filters.department;
      if (filters.search) params.search = filters.search;

      const blob = await exportEmployeesCsv(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'employees.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('CSV exported successfully');
    } catch (error) {
      message.error('Failed to export CSV');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ country: '', job_title: '', department: '', search: '' });
    setSorter({ sort_by: '', sort_direction: '' });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg' as const],
    },
    {
      title: 'Job Title',
      dataIndex: 'job_title',
      key: 'job_title',
      sorter: true,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      responsive: ['md' as const],
      render: (dept: string) => <Tag color="blue">{dept}</Tag>,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: true,
      render: (country: string) => <Tag color="green">{country}</Tag>,
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      sorter: true,
      align: 'right' as const,
      render: (salary: number) => formatCurrency(salary),
    },
    {
      title: 'Date of Joining',
      dataIndex: 'date_of_joining',
      key: 'date_of_joining',
      responsive: ['lg' as const],
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Employee) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this employee?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Employees
          </Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<DownloadOutlined />} onClick={handleExportCsv}>
              Export CSV
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Add Employee
            </Button>
          </Space>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search employees..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Country"
              value={filters.country || undefined}
              onChange={(value) => handleFilterChange('country', value || '')}
              allowClear
              style={{ width: '100%' }}
            >
              {countries.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Job Title"
              value={filters.job_title || undefined}
              onChange={(value) => handleFilterChange('job_title', value || '')}
              allowClear
              style={{ width: '100%' }}
            >
              {jobTitles.map((jt) => (
                <Option key={jt} value={jt}>
                  {jt}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Department"
              value={filters.department || undefined}
              onChange={(value) => handleFilterChange('department', value || '')}
              allowClear
              style={{ width: '100%' }}
            >
              {departments.map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button icon={<ReloadOutlined />} onClick={handleResetFilters} style={{ width: '100%' }}>
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} employees`,
        }}
        onChange={handleTableChange}
      />

      <EmployeeForm
        visible={modalVisible}
        employee={editingEmployee}
        countries={countries}
        jobTitles={jobTitles}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingEmployee(null);
        }}
        loading={formLoading}
      />
    </div>
  );
};

export default EmployeesPage;
