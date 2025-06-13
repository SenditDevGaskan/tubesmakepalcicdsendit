import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './sidebar';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Home: () => <div data-testid="home-icon" />,
  Users: () => <div data-testid="users-icon" />,
  ShoppingCart: () => <div data-testid="shopping-cart-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Wallet: () => <div data-testid="wallet-icon" />,
  LogOutIcon: () => <div data-testid="logout-icon" />
}));

const renderSidebar = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    toggleSidebar: jest.fn(),
    handleLogout: jest.fn()
  };
  
  return render(
    <BrowserRouter>
      <Sidebar {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('Sidebar Component', () => {
  test('renders sidebar with title', () => {
    renderSidebar();
    expect(screen.getByText('Admin Panel Sendit')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    renderSidebar();
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders all icons', () => {
    renderSidebar();
    
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  test('has correct link destinations', () => {
    renderSidebar();
    
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /users/i })).toHaveAttribute('href', '/users');
    expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: /payments/i })).toHaveAttribute('href', '/payment');
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
  });

  test('calls handleLogout when logout button is clicked', () => {
    const mockHandleLogout = jest.fn();
    renderSidebar({ handleLogout: mockHandleLogout });
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(mockHandleLogout).toHaveBeenCalledTimes(1);
  });

  test('applies correct CSS classes when sidebar is open', () => {
    renderSidebar({ isOpen: true });
    const sidebar = screen.getByRole('navigation');
    
    expect(sidebar).toHaveClass('translate-x-0');
    expect(sidebar).not.toHaveClass('-translate-x-full');
  });

  test('applies correct CSS classes when sidebar is closed', () => {
    renderSidebar({ isOpen: false });
    const sidebar = screen.getByRole('navigation');
    
    expect(sidebar).toHaveClass('-translate-x-full');
    expect(sidebar).not.toHaveClass('translate-x-0');
  });

  test('has proper styling classes', () => {
    renderSidebar();
    const sidebar = screen.getByRole('navigation');
    
    expect(sidebar).toHaveClass('bg-indigo-800');
    expect(sidebar).toHaveClass('text-white');
    expect(sidebar).toHaveClass('h-screen');
    expect(sidebar).toHaveClass('w-64');
    expect(sidebar).toHaveClass('fixed');
    expect(sidebar).toHaveClass('left-0');
    expect(sidebar).toHaveClass('top-0');
  });

  test('logout button has correct styling', () => {
    renderSidebar();
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toHaveClass('flex');
    expect(logoutButton).toHaveClass('items-center');
    expect(logoutButton).toHaveClass('p-2');
    expect(logoutButton).toHaveClass('w-full');
  });

  test('navigation links have correct styling', () => {
    renderSidebar();
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveClass('flex');
    expect(dashboardLink).toHaveClass('items-center');
    expect(dashboardLink).toHaveClass('p-2');
    expect(dashboardLink).toHaveClass('rounded');
  });
});