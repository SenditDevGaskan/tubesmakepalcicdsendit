import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

describe('Card Components', () => {
  describe('Card', () => {
    test('renders card with children', () => {
      render(
        <Card>
          <div>Test content</div>
        </Card>
      );
      
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('applies default classes', () => {
      render(
        <Card data-testid="card">
          <div>Test content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white', 'shadow-md', 'rounded-lg');
    });

    test('applies custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          <div>Test content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white', 'shadow-md', 'rounded-lg', 'custom-class');
    });

    test('renders without className prop', () => {
      render(
        <Card data-testid="card">
          <div>Test content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white', 'shadow-md', 'rounded-lg');
    });
  });

  describe('CardHeader', () => {
    test('renders card header with children', () => {
      render(
        <CardHeader>
          <div>Header content</div>
        </CardHeader>
      );
      
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    test('applies default classes', () => {
      render(
        <CardHeader data-testid="card-header">
          <div>Header content</div>
        </CardHeader>
      );
      
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('p-4', 'border-b', 'border-gray-200');
    });

    test('applies custom className', () => {
      render(
        <CardHeader className="custom-header" data-testid="card-header">
          <div>Header content</div>
        </CardHeader>
      );
      
      const header = screen.getByTestId('card-header');
      expect(header).toHaveClass('p-4', 'border-b', 'border-gray-200', 'custom-header');
    });
  });

  describe('CardTitle', () => {
    test('renders card title with children', () => {
      render(
        <CardTitle>
          Title text
        </CardTitle>
      );
      
      expect(screen.getByText('Title text')).toBeInTheDocument();
    });

    test('applies default classes', () => {
      render(
        <CardTitle>
          Title text
        </CardTitle>
      );
      
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('text-xl', 'font-semibold');
      expect(title).toBeInTheDocument();
    });

    test('applies custom className', () => {
      render(
        <CardTitle className="custom-title">
          Title text
        </CardTitle>
      );
      
      const title = screen.getByText('Title text');
      expect(title).toHaveClass('text-xl', 'font-semibold', 'custom-title');
    });
  });

  describe('CardContent', () => {
    test('renders card content with children', () => {
      render(
        <CardContent>
          <p>Content text</p>
        </CardContent>
      );
      
      expect(screen.getByText('Content text')).toBeInTheDocument();
    });

    test('applies default classes', () => {
      render(
        <CardContent data-testid="card-content">
          <p>Content text</p>
        </CardContent>
      );
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('p-4');
    });

    test('applies custom className', () => {
      render(
        <CardContent className="custom-content" data-testid="card-content">
          <p>Content text</p>
        </CardContent>
      );
      
      const content = screen.getByTestId('card-content');
      expect(content).toHaveClass('p-4', 'custom-content');
    });
  });

  describe('Card Components Integration', () => {
    test('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Test content</p>
          </CardContent>
        </Card>
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('applies all custom classes in integration', () => {
      render(
        <Card className="card-custom" data-testid="card">
          <CardHeader className="header-custom" data-testid="header">
            <CardTitle className="title-custom">Test Title</CardTitle>
          </CardHeader>
          <CardContent className="content-custom" data-testid="content">
            <p>Test content</p>
          </CardContent>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      const header = screen.getByTestId('header');
      const title = screen.getByRole('heading', { level: 2 });
      const content = screen.getByTestId('content');
      
      expect(card).toHaveClass('card-custom');
      expect(header).toHaveClass('header-custom');
      expect(title).toHaveClass('title-custom');
      expect(content).toHaveClass('content-custom');
    });
  });
});