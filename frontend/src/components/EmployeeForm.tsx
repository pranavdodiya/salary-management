import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { Employee, EmployeeFormData } from '../types/employee';

const { Option } = Select;

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Product',
  'Design',
  'Legal',
  'Support',
];

interface EmployeeFormProps {
  visible: boolean;
  employee: Employee | null;
  countries: string[];
  jobTitles: string[];
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  visible,
  employee,
  countries,
  jobTitles,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (employee) {
        form.setFieldsValue({
          ...employee,
          date_of_joining: employee.date_of_joining ? dayjs(employee.date_of_joining) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, employee, form]);

  const handleFinish = (values: any) => {
    const data: EmployeeFormData = {
      ...values,
      date_of_joining: values.date_of_joining
        ? values.date_of_joining.format('YYYY-MM-DD')
        : '',
    };
    onSubmit(data);
  };

  return (
    <Modal
      title={employee ? 'Edit Employee' : 'Add Employee'}
      open={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
      confirmLoading={loading}
      width={720}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter first name' }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter last name' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="job_title"
              label="Job Title"
              rules={[{ required: true, message: 'Please select job title' }]}
            >
              <Select placeholder="Select Job Title" showSearch allowClear>
                {jobTitles.map((title) => (
                  <Option key={title} value={title}>
                    {title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select department' }]}
            >
              <Select placeholder="Select Department" showSearch allowClear>
                {DEPARTMENTS.map((dept) => (
                  <Option key={dept} value={dept}>
                    {dept}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Please select country' }]}
            >
              <Select placeholder="Select Country" showSearch allowClear>
                {countries.map((c) => (
                  <Option key={c} value={c}>
                    {c}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="salary"
              label="Salary"
              rules={[{ required: true, message: 'Please enter salary' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '') as any}
                placeholder="Salary"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date_of_joining"
              label="Date of Joining"
              rules={[{ required: true, message: 'Please select date of joining' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;
