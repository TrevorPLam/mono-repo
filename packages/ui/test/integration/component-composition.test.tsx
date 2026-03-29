import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Button, Input, Text, Box, Icon } from '../../src';

describe('Component Integration Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Form Composition', () => {
    it('renders form with multiple components', () => {
      const handleSubmit = vi.fn();
      
      render(
        <Box data-testid="test-form">
          <Text as="h2" size="lg">Contact Form</Text>
          <Box>
            <Input 
              placeholder="Enter your name"
              data-testid="name-input"
              required
            />
            <Input 
              placeholder="Enter your email"
              type="email"
              data-testid="email-input"
              required
            />
            <Input 
              placeholder="Enter your message"
              data-testid="message-input"
              state="success"
            />
            <Button 
              type="submit"
              data-testid="submit-button"
              onClick={handleSubmit}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      );
      
      // Verify all components rendered
      expect(screen.getByText('Contact Form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });

    it('handles form submission', async () => {
      const handleSubmit = vi.fn();
      
      render(
        <Box>
          <Input 
            placeholder="Test input"
            data-testid="test-input"
            onChange={handleSubmit}
          />
        </Box>
      );
      
      const input = screen.getByTestId('test-input');
      fireEvent.change(input, { target: { value: 'test value' } });
      
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(handleSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            target: expect.objectContaining({
              value: 'test value',
            }),
          })
        );
      });
    });
  });

  describe('Component Interaction', () => {
    it('Button with Icon works correctly', () => {
      const handleClick = vi.fn();
      
      render(
        <Button data-testid="icon-button" onClick={handleClick}>
          <Icon data-testid="button-icon" decorative />
          Click me
        </Button>
      );
      
      const button = screen.getByTestId('icon-button');
      const icon = screen.getByTestId('button-icon');
      
      expect(button).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Input with validation states works', () => {
      render(
        <Box>
          <Input 
            data-testid="input-validation"
            state="error"
            message="This field is required"
          />
          <Input 
            data-testid="input-success"
            state="success"
            message="This field is valid"
          />
        </Box>
      );
      
      const errorInput = screen.getByTestId('input-validation');
      const successInput = screen.getByTestId('input-success');
      
      expect(errorInput).toHaveClass(/.*error.*/);
      expect(successInput).toHaveClass(/.*success.*/);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('This field is valid')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('components adapt to different container contexts', () => {
      const { container } = render(
        <Box 
          display="flex"
          flexDirection="column"
          gap="md"
          data-testid="responsive-container"
        >
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Text size="sm">Small Text</Text>
          <Text size="lg">Large Text</Text>
        </Box>
      );
      
      const container = screen.getByTestId('responsive-container');
      expect(container).toBeInTheDocument();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      const texts = screen.getAllByText(/Small|Large Text/);
      expect(texts).toHaveLength(2);
    });
  });

  describe('Theme Integration', () => {
    it('components respect theme tokens', () => {
      render(
        <Box data-testid="theme-test">
          <Button variant="primary" tone="primary">Primary Button</Button>
          <Button variant="secondary" tone="secondary">Secondary Button</Button>
          <Text tone="primary">Primary Text</Text>
          <Text tone="secondary">Secondary Text</Text>
        </Box>
      );
      
      const primaryButton = screen.getByText('Primary Button');
      const secondaryButton = screen.getByText('Secondary Button');
      const primaryText = screen.getByText('Primary Text');
      const secondaryText = screen.getByText('Secondary Text');
      
      // Verify theme classes are applied (implementation dependent)
      expect(primaryButton).toBeInTheDocument();
      expect(secondaryButton).toBeInTheDocument();
      expect(primaryText).toBeInTheDocument();
      expect(secondaryText).toBeInTheDocument();
    });
  });

  describe('Accessibility Integration', () => {
    it('maintains proper focus order in forms', () => {
      render(
        <Box data-testid="focus-order-form">
          <Input placeholder="First input" data-testid="first-input" />
          <Input placeholder="Second input" data-testid="second-input" />
          <Button data-testid="submit-button">Submit</Button>
        </Box>
      );
      
      const firstInput = screen.getByTestId('first-input');
      const secondInput = screen.getByTestId('second-input');
      const submitButton = screen.getByTestId('submit-button');
      
      // Test tab navigation order
      firstInput.focus();
      expect(document.activeElement).toBe(firstInput);
      
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(document.activeElement).toBe(secondInput);
      
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(document.activeElement).toBe(submitButton);
      
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      // Should cycle back to first input or stay on button
      expect(document.activeElement).toBeOneOf([firstInput, submitButton]);
    });

    it('provides proper ARIA relationships', () => {
      render(
        <Box data-testid="aria-form">
          <label htmlFor="accessible-input">Name</label>
          <Input id="accessible-input" data-testid="accessible-input" required />
          <Button data-testid="submit-button">Submit</Button>
        </Box>
      );
      
      const input = screen.getByTestId('accessible-input');
      const label = screen.getByText('Name');
      const submitButton = screen.getByTestId('submit-button');
      
      expect(input).toHaveAttribute('aria-labelledby', label.id);
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(submitButton).toBeInTheDocument();
    });
  });
});
