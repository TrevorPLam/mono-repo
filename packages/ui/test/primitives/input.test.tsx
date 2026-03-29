import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Input } from '../../src/primitives';

describe('Input Primitive', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Rendering', () => {
    it('renders with minimal props', () => {
      render(<Input placeholder="Test input" />);
      const input = screen.getByPlaceholderText('Test input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with custom className', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });

    it('renders with test id', () => {
      render(<Input testId="test-input" />);
      const input = screen.getByTestId('test-input');
      expect(input).toBeInTheDocument();
    });

    it('renders with value prop', () => {
      render(<Input value="Initial value" />);
      const input = screen.getByDisplayValue('Initial value');
      expect(input).toHaveValue('Initial value');
    });

    it('renders as required field', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('renders disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Input Types', () => {
    it('renders text input by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders email input', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input', () => {
      render(<Input type="password" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders number input', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders search input', () => {
      render(<Input type="search" />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });
  });

  describe('Input States', () => {
    it('applies error state styling', () => {
      render(<Input state="error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(/.*error.*/);
    });

    it('shows validation message in error state', () => {
      render(<Input state="error" message="Error message" />);
      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByText('Error message');
      expect(errorMessage).toBeInTheDocument();
    });

    it('applies success state styling', () => {
      render(<Input state="success" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass(/.*success.*/);
    });
  });

  describe('Accessibility', () => {
    it('has proper textbox role', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('role', 'textbox');
    });

    it('supports keyboard navigation', () => {
      render(<Input data-testid="keyboard-input" />);
      const input = screen.getByTestId('keyboard-input');
      
      // Test keyboard focus
      input.focus();
      expect(document.activeElement).toBe(input);
      
      // Test keyboard input
      fireEvent.change(input, { target: { value: 'test input' } });
      expect(input).toHaveValue('test input');
    });

    it('has proper ARIA attributes', () => {
      render(<Input required aria-label="Test input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Test input');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Events', () => {
    it('handles change events', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'new value',
          }),
        })
      );
    });

    it('handles focus events', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('handles blur events', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('prevents input when disabled', () => {
      const handleChange = vi.fn();
      render(<Input disabled onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Input Features', () => {
    it('supports autocomplete', () => {
      render(<Input autoComplete="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('supports maxlength', () => {
      render(<Input maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxlength', '10');
    });

    it('supports readonly', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
      expect(input).toBeDisabled();
    });

    it('supports placeholder text', () => {
      render(<Input placeholder="Enter your name" />);
      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
    });
  });
});
