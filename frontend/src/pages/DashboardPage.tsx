import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Spin,
  Select,
  Statistic,
  Typography,
} from 'antd';
import {
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  GlobalOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import {
  getOverallInsights,
  getInsightsByCountry,
  getInsightsByJobTitle,
  getInsightsByDepartment,
  getSalaryRanges,
  getTopEarners,
  getCountryPayroll,
  getCountries,
} from '../services/api';
import {
  OverallInsights,
  CountryInsight,
  JobTitleInsight,
  DepartmentInsight,
  SalaryRange,
  CountryPayroll,
  Employee,
} from '../types/employee';

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

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overall, setOverall] = useState<OverallInsights | null>(null);
  const [countryInsights, setCountryInsights] = useState<CountryInsight[]>([]);
  const [jobTitleInsights, setJobTitleInsights] = useState<JobTitleInsight[]>([]);
  const [departmentInsights, setDepartmentInsights] = useState<DepartmentInsight[]>([]);
  const [salaryRanges, setSalaryRanges] = useState<SalaryRange[]>([]);
  const [topEarners, setTopEarners] = useState<Employee[]>([]);
  const [countryPayrollData, setCountryPayrollData] = useState<CountryPayroll[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          overallRes,
          countryRes,
          departmentRes,
          rangesRes,
          countriesRes,
          topEarnersRes,
          payrollRes,
          jobTitleRes,
        ] = await Promise.all([
          getOverallInsights(),
          getInsightsByCountry(),
          getInsightsByDepartment(),
          getSalaryRanges(),
          getCountries(),
          getTopEarners(10),
          getCountryPayroll(),
          getInsightsByJobTitle(),
        ]);
        setOverall(overallRes.overall);
        setCountryInsights(countryRes.data);
        setDepartmentInsights(departmentRes.data);
        setSalaryRanges(rangesRes.data);
        setCountries(countriesRes.data);
        setTopEarners(topEarnersRes.data);
        setCountryPayrollData(payrollRes.data);
        setJobTitleInsights(jobTitleRes.data);
      } catch (error) {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCountryChange = async (value: string | undefined) => {
    setSelectedCountry(value);
    try {
      const res = await getInsightsByJobTitle(value);
      setJobTitleInsights(res.data);
    } catch (error) {
      // silently fail
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const maxRangeCount = salaryRanges.length > 0 ? Math.max(...salaryRanges.map((r) => r.count)) : 1;

  const countryColumns = [
    { title: 'Country', dataIndex: 'country', key: 'country', sorter: (a: CountryInsight, b: CountryInsight) => a.country.localeCompare(b.country), render: (c: string) => <Tag color="green">{c}</Tag> },
    { title: 'Employees', dataIndex: 'employee_count', key: 'employee_count', sorter: (a: CountryInsight, b: CountryInsight) => a.employee_count - b.employee_count },
    { title: 'Avg Salary', dataIndex: 'average_salary', key: 'average_salary', sorter: (a: CountryInsight, b: CountryInsight) => a.average_salary - b.average_salary, render: (v: number) => formatCurrency(v) },
    { title: 'Min Salary', dataIndex: 'min_salary', key: 'min_salary', sorter: (a: CountryInsight, b: CountryInsight) => a.min_salary - b.min_salary, render: (v: number) => formatCurrency(v) },
    { title: 'Max Salary', dataIndex: 'max_salary', key: 'max_salary', sorter: (a: CountryInsight, b: CountryInsight) => a.max_salary - b.max_salary, render: (v: number) => formatCurrency(v) },
  ];

  const jobTitleColumns = [
    { title: 'Job Title', dataIndex: 'job_title', key: 'job_title', sorter: (a: JobTitleInsight, b: JobTitleInsight) => a.job_title.localeCompare(b.job_title) },
    { title: 'Employees', dataIndex: 'employee_count', key: 'employee_count', sorter: (a: JobTitleInsight, b: JobTitleInsight) => a.employee_count - b.employee_count },
    { title: 'Avg Salary', dataIndex: 'average_salary', key: 'average_salary', sorter: (a: JobTitleInsight, b: JobTitleInsight) => a.average_salary - b.average_salary, render: (v: number) => formatCurrency(v) },
    { title: 'Min Salary', dataIndex: 'min_salary', key: 'min_salary', sorter: (a: JobTitleInsight, b: JobTitleInsight) => a.min_salary - b.min_salary, render: (v: number) => formatCurrency(v) },
    { title: 'Max Salary', dataIndex: 'max_salary', key: 'max_salary', sorter: (a: JobTitleInsight, b: JobTitleInsight) => a.max_salary - b.max_salary, render: (v: number) => formatCurrency(v) },
  ];

  const departmentColumns = [
    { title: 'Department', dataIndex: 'department', key: 'department', sorter: (a: DepartmentInsight, b: DepartmentInsight) => a.department.localeCompare(b.department), render: (d: string) => <Tag color="blue">{d}</Tag> },
    { title: 'Employees', dataIndex: 'employee_count', key: 'employee_count', sorter: (a: DepartmentInsight, b: DepartmentInsight) => a.employee_count - b.employee_count },
    { title: 'Avg Salary', dataIndex: 'average_salary', key: 'average_salary', sorter: (a: DepartmentInsight, b: DepartmentInsight) => a.average_salary - b.average_salary, render: (v: number) => formatCurrency(v) },
    { title: 'Min Salary', dataIndex: 'min_salary', key: 'min_salary', sorter: (a: DepartmentInsight, b: DepartmentInsight) => a.min_salary - b.min_salary, render: (v: number) => formatCurrency(v) },
    { title: 'Max Salary', dataIndex: 'max_salary', key: 'max_salary', sorter: (a: DepartmentInsight, b: DepartmentInsight) => a.max_salary - b.max_salary, render: (v: number) => formatCurrency(v) },
  ];

  const payrollColumns = [
    { title: 'Country', dataIndex: 'country', key: 'country', sorter: (a: CountryPayroll, b: CountryPayroll) => a.country.localeCompare(b.country), render: (c: string) => <Tag color="green">{c}</Tag> },
    { title: 'Employees', dataIndex: 'employee_count', key: 'employee_count', sorter: (a: CountryPayroll, b: CountryPayroll) => a.employee_count - b.employee_count },
    { title: 'Total Payroll', dataIndex: 'total_payroll', key: 'total_payroll', sorter: (a: CountryPayroll, b: CountryPayroll) => a.total_payroll - b.total_payroll, render: (v: number) => formatCurrency(v) },
    { title: 'Avg Salary', dataIndex: 'average_salary', key: 'average_salary', sorter: (a: CountryPayroll, b: CountryPayroll) => a.average_salary - b.average_salary, render: (v: number) => formatCurrency(v) },
  ];

  return (
    <div>
      <Title level={3}>Dashboard</Title>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic title="Total Employees" value={overall?.total_employees || 0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic title="Average Salary" value={overall?.average_salary || 0} prefix={<DollarOutlined />} formatter={(v) => formatCurrency(Number(v))} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic title="Median Salary" value={overall?.median_salary || 0} prefix={<BarChartOutlined />} formatter={(v) => formatCurrency(Number(v))} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic title="Min Salary" value={overall?.min_salary || 0} prefix={<FallOutlined />} formatter={(v) => formatCurrency(Number(v))} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic title="Max Salary" value={overall?.max_salary || 0} prefix={<RiseOutlined />} formatter={(v) => formatCurrency(Number(v))} />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic title="Countries" value={countries.length} prefix={<GlobalOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Salary Distribution */}
      <Card title="Salary Distribution" style={{ marginBottom: 24 }}>
        {salaryRanges.map((range) => (
          <div key={range.range} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 120, flexShrink: 0, fontSize: 13 }}>{range.range}</div>
            <div
              style={{
                height: 24,
                width: `${(range.count / maxRangeCount) * 100}%`,
                maxWidth: '80%',
                backgroundColor: '#1890ff',
                borderRadius: 4,
                marginRight: 8,
                minWidth: range.count > 0 ? 4 : 0,
              }}
            />
            <span style={{ fontSize: 13 }}>{range.count}</span>
          </div>
        ))}
      </Card>

      {/* Top Earners & Country Payroll */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title={<span><TrophyOutlined /> Top 10 Highest Paid</span>}>
            <Table
              dataSource={topEarners}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: '#',
                  key: 'rank',
                  width: 50,
                  render: (_: any, __: any, index: number) => (
                    <Tag color="gold">{index + 1}</Tag>
                  ),
                },
                { title: 'Name', dataIndex: 'full_name', key: 'full_name' },
                { title: 'Job Title', dataIndex: 'job_title', key: 'job_title' },
                {
                  title: 'Salary',
                  dataIndex: 'salary',
                  key: 'salary',
                  align: 'right' as const,
                  render: (v: number) => formatCurrency(v),
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Country Payroll">
            <Table
              dataSource={countryPayrollData}
              rowKey="country"
              pagination={false}
              size="small"
              columns={payrollColumns}
            />
          </Card>
        </Col>
      </Row>

      {/* By Country */}
      <Card title="By Country" style={{ marginBottom: 24 }}>
        <Table
          dataSource={countryInsights}
          rowKey="country"
          pagination={false}
          size="small"
          columns={countryColumns}
        />
      </Card>

      {/* By Job Title */}
      <Card
        title="By Job Title"
        extra={
          <Select
            placeholder="Filter by Country"
            value={selectedCountry}
            onChange={handleCountryChange}
            allowClear
            style={{ width: 200 }}
          >
            {countries.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          dataSource={jobTitleInsights}
          rowKey="job_title"
          pagination={false}
          size="small"
          columns={jobTitleColumns}
        />
      </Card>

      {/* By Department */}
      <Card title="By Department" style={{ marginBottom: 24 }}>
        <Table
          dataSource={departmentInsights}
          rowKey="department"
          pagination={false}
          size="small"
          columns={departmentColumns}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
