import React, { useState } from 'react';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import { DashboardOutlined, TeamOutlined } from '@ant-design/icons';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import './App.css';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'employees',
      icon: <TeamOutlined />,
      label: 'Employees',
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'employees':
        return <EmployeesPage />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="dark"
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: collapsed ? 14 : 20,
              fontWeight: 'bold',
            }}
          >
            {collapsed ? 'SH' : 'SalaryHub'}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[currentPage]}
            items={menuItems}
            onClick={({ key }) => setCurrentPage(key)}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: '0 24px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            <h2 style={{ margin: 0 }}>Salary Management System</h2>
          </Header>
          <Content style={{ margin: 24, padding: 24, background: '#f5f5f5', minHeight: 280 }}>
            {renderPage()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
