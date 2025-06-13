import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaymentPage from './PaymentPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock alert
global.alert = jest.fn();

// Mock confirm
global.confirm = jest.fn();

describe('PaymentPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            metode_pembayaran: 'Credit Card'
          },
          {
            id: 2,
            metode_pembayaran: 'Bank Transfer'
          }
        ]
      }
    });
  });

  test('renders PaymentPage component', async () => {
    render(<PaymentPage />);
    
    expect(screen.getByText('Payment Management')).toBeInTheDocument();
    expect(screen.getByText('Add New Payment Method')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter payment method')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    render(<PaymentPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('loads and displays payment methods', async () => {
    render(<PaymentPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
    });
  });

  test('handles API error when loading payments', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    render(<PaymentPage />);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Error loading payments: API Error');
    });
  });

  test('adds new payment method', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        message: 'Payment method added successfully'
      }
    });
    
    render(<PaymentPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Enter payment method');
    const addButton = screen.getByText('Add Payment Method');
    
    fireEvent.change(input, { target: { value: 'PayPal' } });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/payments',
        { metode_pembayaran: 'PayPal' }
      );
    });
  });

  test('validates empty input when adding payment', () => {
    render(<PaymentPage />);
    
    const addButton = screen.getByText('Add Payment Method');
    fireEvent.click(addButton);
    
    expect(global.alert).toHaveBeenCalledWith('Please enter a payment method');
  });

  test('handles error when adding payment method', async () => {
    mockedAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Payment method already exists'
        }
      }
    });
    
    render(<PaymentPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Enter payment method');
    const addButton = screen.getByText('Add Payment Method');
    
    fireEvent.change(input, { target: { value: 'Duplicate Method' } });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Error adding payment: Payment method already exists');
    });
  });

  test('enters edit mode when edit button is clicked', async () => {
    render(<PaymentPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(screen.getByDisplayValue('Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('saves edited payment method', async () => {
    mockedAxios.put.mockResolvedValue({
      data: {
        message: 'Payment method updated successfully'
      }
    });
    
    render(<PaymentPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    const input = screen.getByDisplayValue('Credit Card');
    fireEvent.change(input, { target: { value: 'Debit Card' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'http://localhost:8000/api/payments/1',
        { metode_pembayaran: 'Debit Card' }
      );
    });
  });

  test('cancels edit mode', async () => {
    render(<PaymentPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
    
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  test('deletes payment method with confirmation', async () => {
    global.confirm.mockReturnValue(true);
    mockedAxios.delete.mockResolvedValue({
      data: {
        message: 'Payment method deleted successfully'
      }
    });
    
    render(<PaymentPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this payment method?');
    
    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8000/api/payments/1');
    });
  });

  test('cancels delete when user declines confirmation', async () => {
    global.confirm.mockReturnValue(false);
    
    render(<PaymentPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
    
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(global.confirm).toHaveBeenCalled();
    expect(mockedAxios.delete).not.toHaveBeenCalled();
  });
});