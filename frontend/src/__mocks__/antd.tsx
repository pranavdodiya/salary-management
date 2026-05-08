import React from 'react';

const ConfigProvider: React.FC<any> = ({ children }) => <div>{children}</div>;

const Header: React.FC<any> = ({ children, ...props }) => <header {...props}>{children}</header>;
const Content: React.FC<any> = ({ children, ...props }) => <main {...props}>{children}</main>;
const Sider: React.FC<any> = ({ children, ...props }) => <aside {...props}>{children}</aside>;

const Layout: React.FC<any> & { Header: typeof Header; Content: typeof Content; Sider: typeof Sider } = ({ children, ...props }) => <div {...props}>{children}</div>;
Layout.Header = Header;
Layout.Content = Content;
Layout.Sider = Sider;

const Menu: React.FC<any> = ({ items, onClick, ...props }) => (
  <nav {...props}>
    {items?.map((item: any) => (
      <div key={item.key} data-testid={`menu-${item.key}`} onClick={() => onClick?.({ key: item.key })}>
        {item.label}
      </div>
    ))}
  </nav>
);

const Option: React.FC<any> = ({ children, ...props }) => <option {...props}>{children}</option>;

const Select: React.FC<any> & { Option: typeof Option } = ({ children, placeholder, ...props }) => (
  <select {...props}>{children}</select>
);
Select.Option = Option;

const FormItem: React.FC<any> = ({ children, label }) => (
  <div>
    {label && <label>{label}</label>}
    {children}
  </div>
);

const useForm = () => {
  const form = {
    setFieldsValue: jest.fn(),
    resetFields: jest.fn(),
    getFieldsValue: jest.fn(),
    submit: jest.fn(),
    validateFields: jest.fn().mockResolvedValue({}),
  };
  return [form];
};

const Form: React.FC<any> & { Item: typeof FormItem; useForm: typeof useForm } = ({ children, onFinish, ...props }) => (
  <form onSubmit={(e) => { e.preventDefault(); onFinish?.({}); }} {...props}>{children}</form>
);
Form.Item = FormItem;
Form.useForm = useForm;

const Table: React.FC<any> = ({ dataSource, columns, ...props }) => (
  <table>
    <thead>
      <tr>
        {columns?.map((col: any) => (
          <th key={col.key || col.dataIndex}>{col.title}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {dataSource?.map((row: any, i: number) => (
        <tr key={row.id || row.key || i}>
          {columns?.map((col: any) => (
            <td key={col.key || col.dataIndex}>
              {col.render ? col.render(row[col.dataIndex], row, i) : row[col.dataIndex]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const Button: React.FC<any> = ({ children, onClick, ...props }) => (
  <button onClick={onClick} {...props}>{children}</button>
);

const Input: React.FC<any> = (props) => <input {...props} />;

const InputNumber: React.FC<any> = (props) => <input type="number" {...props} />;

const DatePicker: React.FC<any> = (props) => <input type="date" {...props} />;

const Card: React.FC<any> = ({ children, title, extra, ...props }) => (
  <div {...props}>
    {title && <div className="ant-card-head">{title}{extra}</div>}
    {children}
  </div>
);

const Row: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const Col: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const Space: React.FC<any> = ({ children }) => <div>{children}</div>;

const Tag: React.FC<any> = ({ children, color }) => <span className={`tag-${color}`}>{children}</span>;

const Statistic: React.FC<any> = ({ title, value, prefix, formatter }) => (
  <div>
    <div>{title}</div>
    <div>{prefix}{formatter ? formatter(value) : value}</div>
  </div>
);

const Spin: React.FC<any> = ({ children, ...props }) => <div {...props}>{children || 'Loading...'}</div>;

const Title: React.FC<any> = ({ children, level, ...props }) => {
  const lvl = level || 1;
  if (lvl === 1) return <h1 {...props}>{children}</h1>;
  if (lvl === 2) return <h2 {...props}>{children}</h2>;
  if (lvl === 3) return <h3 {...props}>{children}</h3>;
  if (lvl === 4) return <h4 {...props}>{children}</h4>;
  return <h5 {...props}>{children}</h5>;
};
const Text: React.FC<any> = ({ children, ...props }) => <span {...props}>{children}</span>;
const Typography: any = { Title, Text };

const Popconfirm: React.FC<any> = ({ children, onConfirm }) => (
  <div onClick={onConfirm}>{children}</div>
);

const Modal: React.FC<any> = ({ children, title, open, visible, ...props }) => {
  if (!open && !visible) return null;
  return (
    <div data-testid="modal">
      <div>{title}</div>
      {children}
    </div>
  );
};

const message = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
};

const theme_obj = {
  defaultAlgorithm: 'default',
};

export {
  ConfigProvider,
  Layout,
  Menu,
  Select,
  Form,
  Table,
  Button,
  Input,
  InputNumber,
  DatePicker,
  Card,
  Row,
  Col,
  Space,
  Tag,
  Statistic,
  Spin,
  Typography,
  Popconfirm,
  Modal,
  message,
  theme_obj as theme,
};
