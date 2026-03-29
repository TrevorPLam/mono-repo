import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Button } from '../../src/primitives';

describe('Button Primitive', () => {
  beforeEach(() => {
    // Reset any global state before each test
    document.body.innerHTML = '';
  });

  describe('Rendering', () => {
    it('renders with minimal props', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test');
    });

    it('renders with custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('renders with test id', () => {
      render(<Button testId="test-button">Test</Button>);
      const button = screen.getByTestId('test-button');
      expect(button).toBeInTheDocument();
    });

    it('renders with data attributes', () => {
      render(
        <Button 
          data-testid="data-button"
          data-variant="primary"
          data-size="md"
        >
          Test
        </Button>
      );
      const button = screen.getByTestId('data-button');
      expect(button).toHaveAttribute('data-variant', 'primary');
      expect(button).toHaveAttribute('data-size', 'md');
    });
  });

  describe('Variants', () => {
    it('applies primary variant', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*primary.*/);
    });

    it('applies secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*secondary.*/);
    });

    it('applies outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*outline.*/);
    });

    it('applies accent variant', () => {
      render(<Button variant="accent">Accent</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*accent.*/);
    });

    it('applies success variant', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*success.*/);
    });

    it('applies warning variant', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*warning.*/);
    });

    it('applies error variant', () => {
      render(<Button variant="error">Error</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*error.*/);
    });
  });

  describe('Sizes', () => {
    it('applies sm size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*sm.*/);
    });

    it('applies md size', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*md.*/);
    });

    it('applies lg size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(/.*lg.*/);
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('shows loading state with spinner', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      // Check for loading spinner
      const spinner = button.querySelector('span');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveStyle({
        width: '16px',
        height: '16px',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      });
    });

    it('combines disabled and loading states', () => {
      render(<Button disabled loading>Disabled Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Types', () => {
    it('renders as button type by default', () => {
      render(<Button>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders as submit type', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('renders as reset type', () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });
  });

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('role', 'button');
    });

    it('supports keyboard navigation', () => {
      render(<Button>Keyboard Test</Button>);
      const button = screen.getByRole('button');
      
      // Test keyboard focus
      button.focus();
      expect(document.activeElement).toBe(button);
      
      // Test keyboard activation
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });
    });

    it('has proper ARIA attributes', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Events', () => {
    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
          target: expect.any(HTMLElement),
        })
      );
    });

    it('prevents click when disabled', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents click when loading', () => {
      const handleClick = vi.fn();
      render(<Button loading onClick={handleClick}>Loading</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Composition', () => {
    it('renders children correctly', () => {
      render(
        <Button>
          <span data-testid="button-child">Child content</span>
        </Button>
      );
      
      const button = screen.getByRole('button');
      const child = screen.getByTestId('button-child');
      
      expect(button).toBeInTheDocument();
      expect(child).toBeInTheDocument();
      expect(child).toHaveTextContent('Child content');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Button ref={ref}>Ref Test</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveTextContent('Ref Test');
    });
  });
});
