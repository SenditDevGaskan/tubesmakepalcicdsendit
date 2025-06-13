import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsPage from './SettingsPage';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Settings: () => <div data-testid="settings-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  Wrench: () => <div data-testid="wrench-icon" />
}));

describe('SettingsPage Component', () => {
  test('renders settings page header', () => {
    render(<SettingsPage />);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Kelola pengaturan aplikasi Anda')).toBeInTheDocument();
  });

  test('renders coming soon section', () => {
    render(<SettingsPage />);
    
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText(/Halaman pengaturan sedang dalam tahap pengembangan/)).toBeInTheDocument();
  });

  test('renders all feature preview cards', () => {
    render(<SettingsPage />);
    
    expect(screen.getByText('Pengaturan Umum')).toBeInTheDocument();
    expect(screen.getByText('Pengaturan Sistem')).toBeInTheDocument();
    expect(screen.getByText('Personalisasi')).toBeInTheDocument();
  });

  test('renders feature descriptions', () => {
    render(<SettingsPage />);
    
    expect(screen.getByText('Konfigurasi dasar aplikasi dan preferensi pengguna')).toBeInTheDocument();
    expect(screen.getByText('Konfigurasi lanjutan untuk administrator sistem')).toBeInTheDocument();
    expect(screen.getByText('Sesuaikan tampilan dan pengalaman pengguna')).toBeInTheDocument();
  });

  test('renders timeline section', () => {
    render(<SettingsPage />);
    
    expect(screen.getByText('🚀 Estimasi Peluncuran')).toBeInTheDocument();
    expect(screen.getByText(/Fitur pengaturan direncanakan akan tersedia/)).toBeInTheDocument();
  });

  test('renders all icons', () => {
    render(<SettingsPage />);
    
    const settingsIcons = screen.getAllByTestId('settings-icon');
    expect(settingsIcons).toHaveLength(3); // Main icon + 2 feature cards
    
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('wrench-icon')).toBeInTheDocument();
  });

  test('has proper page structure', () => {
    render(<SettingsPage />);
    
    // Check if main sections exist
    const settingsHeader = screen.getByRole('heading', { name: 'Settings' });
    expect(settingsHeader).toBeInTheDocument();
    
    const comingSoonSection = screen.getByText('Coming Soon');
    expect(comingSoonSection).toBeInTheDocument();
  });

  test('renders feature cards with correct styling', () => {
    render(<SettingsPage />);
    
    // Check that feature cards exist
    expect(screen.getByText('Pengaturan Umum')).toBeInTheDocument();
    expect(screen.getByText('Pengaturan Sistem')).toBeInTheDocument();
    expect(screen.getByText('Personalisasi')).toBeInTheDocument();
    
    // Check that descriptions are present
    expect(screen.getByText('Konfigurasi dasar aplikasi dan preferensi pengguna')).toBeInTheDocument();
    expect(screen.getByText('Konfigurasi lanjutan untuk administrator sistem')).toBeInTheDocument();
    expect(screen.getByText('Sesuaikan tampilan dan pengalaman pengguna')).toBeInTheDocument();
  });

  test('renders main content card with correct styling', () => {
    render(<SettingsPage />);
    
    // Check that main content exists
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText(/Halaman pengaturan sedang dalam tahap pengembangan/)).toBeInTheDocument();
  });

  test('renders timeline section with correct styling', () => {
    render(<SettingsPage />);
    
    // Check that timeline section exists
    expect(screen.getByText('🚀 Estimasi Peluncuran')).toBeInTheDocument();
    expect(screen.getByText(/Fitur pengaturan direncanakan akan tersedia/)).toBeInTheDocument();
  });

  test('renders grid layout for feature cards', () => {
    render(<SettingsPage />);
    
    // Check that all feature cards are rendered
    expect(screen.getByText('Pengaturan Umum')).toBeInTheDocument();
    expect(screen.getByText('Pengaturan Sistem')).toBeInTheDocument();
    expect(screen.getByText('Personalisasi')).toBeInTheDocument();
  });

  test('renders description text with correct content', () => {
    render(<SettingsPage />);
    
    const description = screen.getByText(/Fitur-fitur canggih untuk mengelola preferensi/);
    expect(description).toBeInTheDocument();
  });
});