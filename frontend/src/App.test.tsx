import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

jest.mock('./pages/DashboardPage', () => {
  return function MockDashboardPage() {
    return <div data-testid="dashboard-page">Dashboard Content</div>;
  };
});

jest.mock('./pages/EmployeesPage', () => {
  return function MockEmployeesPage() {
    return <div data-testid="employees-page">Employees Content</div>;
  };
});

describe('App', () => {
  test('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Salary Management System')).toBeInTheDocument();
  });

  test('renders SalaryHub logo text', () => {
    render(<App />);
    expect(screen.getByText('SalaryHub')).toBeInTheDocument();
  });

  test('shows dashboard page by default', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  test('navigates to employees page', () => {
    render(<App />);
    const employeesMenu = screen.getByTestId('menu-employees');
    fireEvent.click(employeesMenu);
    expect(screen.getByTestId('employees-page')).toBeInTheDocument();
  });

  test('navigates back to dashboard', () => {
    render(<App />);
    const employeesMenu = screen.getByTestId('menu-employees');
    fireEvent.click(employeesMenu);
    expect(screen.getByTestId('employees-page')).toBeInTheDocument();

    const dashboardMenu = screen.getByTestId('menu-dashboard');
    fireEvent.click(dashboardMenu);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
});
