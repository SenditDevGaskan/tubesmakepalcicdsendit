import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the components to avoid complex dependencies
jest.mock('./sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('./adminDashboard', () => {
  return function MockAdminDashboard() {
    return <div data-testid="admin-dashboard">Admin Dashboard</div>;
  };
});

jest.mock('./Users/UsersPage', () => {
  return function MockUsersPage() {
    return <div data-testid="users-page">Users Page</div>;
  };
});

jest.mock('./Orders/OrderPage', () => {
  return function MockOrderPage() {
    return <div data-testid="order-page">Order Page</div>;
  };
});

jest.mock('./Payment/PaymentPage', () => {
  return function MockPaymentPage() {
    return <div data-testid="payment-page">Payment Page</div>;
  };
});

jest.mock('./Resi/CheckResiPage', () => {
  return function MockCheckResiPage() {
    return <div data-testid="check-resi-page">Check Resi Page</div>;
  };
});

jest.mock('./Settings/SettingsPage', () => {
  return function MockSettingsPage() {
    return <div data-testid="settings-page">Settings Page</div>;
  };
});

jest.mock('./auth/login', () => {
  return function MockLogin() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('./auth/register', () => {
  return function MockRegister() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock('./auth/forgotPassword', () => {
  return function MockForgotPassword() {
    return <div data-testid="forgot-password-page">Forgot Password Page</div>;
  };
});

jest.mock('./auth/resetPassword', () => {
  return function MockResetPassword() {
    return <div data-testid="reset-password-page">Reset Password Page</div>;
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('App Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
  });

  test('renders App component without crashing', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders login page when not authenticated', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders admin dashboard when authenticated', () => {
    localStorageMock.getItem.mockReturnValue('fake-token');
    render(<App />);
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
  });
});
