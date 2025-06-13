import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatCard from './StatCard';
import { Users, Package, Clock } from 'lucide-react';

describe('StatCard Component', () => {
  test('renders StatCard with title and value', () => {
    const props = {
      title: 'Total Users',
      value: '150',
      icon: Users,
      color: 'blue'
    };
    
    render(<StatCard {...props} />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test('renders StatCard with different props', () => {
    const props = {
      title: 'Total Orders',
      value: '75',
      icon: Package,
      color: 'green'
    };
    
    render(<StatCard {...props} />);
    
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  test('renders StatCard with zero value', () => {
    const props = {
      title: 'Pending Orders',
      value: '0',
      icon: Clock,
      color: 'yellow'
    };
    
    render(<StatCard {...props} />);
    
    expect(screen.getByText('Pending Orders')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});