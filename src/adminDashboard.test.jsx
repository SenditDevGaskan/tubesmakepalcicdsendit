import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from './adminDashboard';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock StatCard component
jest.mock('./StatCard', () => {
  return function MockStatCard({ title, value, icon: Icon }) {
    return (
      <div data-testid="stat-card">
        <div>{title}</div>
        <div>{value}</div>
        {Icon && <Icon data-testid="stat-icon" />}
      </div>
    );
  };
});

// Mock recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Users: () => <div data-testid="users-icon" />,
  ShoppingCart: () => <div data-testid="shopping-cart-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  TrendingUp: () => <div data-testid="trending-up-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />
}));

// Mock API_CONFIG
jest.mock('./config', () => ({
  default: {
    BASE_URL: 'https://sendit.aident.my.id',
    API_ENDPOINTS: {
      ORDERS: '/api/pemesanan',
      PAYMENTS: '/api/payments',
      USERS: '/api/users'
    }
  }
}));

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/api/pemesanan')) {
        return Promise.resolve({
          data: [
            { id: 1, total_harga: 100000 },
            { id: 2, total_harga: 150000 }
          ]
        });
      }
      if (url.includes('/api/payments')) {
        return Promise.resolve({
          data: [
            { month: 'January', sales: 500000, harga: 500000 },
            { month: 'February', sales: 750000, harga: 750000 }
          ]
        });
      }
      if (url.includes('/api/users')) {
        return Promise.resolve({
          data: [
            { id: 1, name: 'User 1', role: 'pemesan' },
            { id: 2, name: 'User 2', role: 'admin' },
            { id: 3, name: 'User 3', role: 'pemesan' }
          ]
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  test('renders AdminDashboard component', async () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<AdminDashboard />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  test('fetches and displays data successfully', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('https://sendit.aident.my.id/api/pemesanan');
    });
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('https://sendit.aident.my.id/api/payments');
    });
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('https://sendit.aident.my.id/api/users');
    });

    expect(screen.getByText('Sales Overview')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
    });
  });

  test('displays chart components', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  test('renders StatCard components with correct props', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
  });

  test('displays recent activity items', () => {
    render(<AdminDashboard />);
    
    const activityItems = screen.getAllByText('New user registered');
    expect(activityItems).toHaveLength(4);
    
    const timeStamps = screen.getAllByText('2 minutes ago');
    expect(timeStamps).toHaveLength(4);
  });

  test('handles orders fetch error', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/api/pemesanan')) {
        return Promise.reject(new Error('Orders API Error'));
      }
      if (url.includes('/api/payments')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/users')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
    
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch orders')).toBeInTheDocument();
    });
  });

  test('handles payments fetch error', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/api/pemesanan')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/payments')) {
        return Promise.reject(new Error('Payments API Error'));
      }
      if (url.includes('/api/users')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
    
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch payments')).toBeInTheDocument();
    });
  });

  test('handles users fetch error', async () => {
    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/api/pemesanan')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/payments')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/users')) {
        return Promise.reject(new Error('Users API Error'));
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
    
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch users')).toBeInTheDocument();
    });
  });
});