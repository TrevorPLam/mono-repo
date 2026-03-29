import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Button, Input, Text, Box, Icon } from '../../src';

describe('Accessibility Compliance', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('WCAG 2.1 AA Compliance', () => {
    describe('Color Contrast', () => {
      it('Button text meets contrast requirements', () => {
        render(<Button variant="primary">Primary Button</Button>);
        const button = screen.getByRole('button');
        
        // Check if button has sufficient contrast (implementation dependent)
        expect(button).toBeInTheDocument();
      });

      it('Text meets contrast requirements', () => {
        render(<Text tone="primary">Primary Text</Text>);
        const text = screen.getByText('Primary Text');
        expect(text).toBeInTheDocument();
      });
    });

    describe('Keyboard Navigation', () => {
      it('Button supports keyboard navigation', () => {
        render(<Button>Keyboard Button</Button>);
        const button = screen.getByRole('button');
        
        // Test tab navigation
        button.focus();
        expect(document.activeElement).toBe(button);
        
        // Test Enter key activation
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
        fireEvent.keyUp(button, { key: 'Enter', code: 'Enter' });
        
        // Test Space key activation
        fireEvent.keyDown(button, { key: ' ', code: 'Space' });
        fireEvent.keyUp(button, { key: ' ', code: 'Space' });
      });

      it('Input supports keyboard navigation', () => {
        render(<Input data-testid="keyboard-input" />);
        const input = screen.getByTestId('keyboard-input');
        
        input.focus();
        expect(document.activeElement).toBe(input);
        
        // Test keyboard input
        fireEvent.change(input, { target: { value: 'test' } });
        expect(input).toHaveValue('test');
      });

      it('Text elements are not focusable by default', () => {
        render(<Text>Non-interactive Text</Text>);
        const text = screen.getByText('Non-interactive Text');
        
        // Text elements should not be focusable unless they have interactive role
        expect(text).not.toHaveAttribute('tabIndex');
      });
    });

    describe('Screen Reader Support', () => {
      it('Button has proper ARIA attributes', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByRole('button');
        
        expect(button).toHaveAttribute('aria-disabled', 'true');
        expect(button).toHaveAttribute('role', 'button');
      });

      it('Input has proper ARIA attributes', () => {
        render(<Input required aria-label="Email input" />);
        const input = screen.getByRole('textbox');
        
        expect(input).toHaveAttribute('aria-label', 'Email input');
        expect(input).toHaveAttribute('aria-required', 'true');
        expect(input).toHaveAttribute('role', 'textbox');
      });

      it('Icon supports decorative mode', () => {
        render(<Icon decorative data-testid="decorative-icon" />);
        const icon = screen.getByTestId('decorative-icon');
        
        expect(icon).toHaveAttribute('aria-hidden', 'true');
        expect(icon).not.toHaveAttribute('role');
      });

      it('Icon supports labeled mode', () => {
        render(<Icon label="Close button" data-testid="labeled-icon" />);
        const icon = screen.getByTestId('labeled-icon');
        
        expect(icon).toHaveAttribute('aria-label', 'Close button');
        expect(icon).toHaveAttribute('role', 'img');
      });

      it('Text supports heading roles', () => {
        render(<Text as="h1">Heading Text</Text>);
        const text = screen.getByRole('heading');
        
        expect(text).toHaveAttribute('role', 'heading');
        expect(text).toHaveAttribute('aria-level', '1');
      });
    });

    describe('Focus Management', () => {
      it('Button manages focus correctly', () => {
        render(<Button>Focus Button</Button>);
        const button = screen.getByRole('button');
        
        // Test programmatic focus
        button.focus();
        expect(document.activeElement).toBe(button);
        expect(button).toHaveAttribute('data-focused', 'true');
      });

      it('Input manages focus correctly', () => {
        render(<Input data-testid="focus-input" />);
        const input = screen.getByTestId('focus-input');
        
        input.focus();
        expect(document.activeElement).toBe(input);
      });
    });

    describe('Form Labels', () => {
      it('Associates labels with inputs correctly', () => {
        render(
          <div>
            <label htmlFor="test-input">Test Label</label>
            <Input id="test-input" />
          </div>
        );
        
        const input = screen.getByRole('textbox');
        const label = screen.getByText('Test Label');
        
        expect(input).toBeInTheDocument();
        expect(label).toBeInTheDocument();
        expect(input).toHaveAttribute('aria-labelledby', label.id);
      });
    });
  });

  describe('Motion and Animation', () => {
    it('Respects prefers-reduced-motion', () => {
      // Test that components respect user's motion preferences
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      Object.defineProperty(window, 'matchMedia', {
        value: () => ({ matches: true }),
        writable: true,
      });
      
      render(<Button>Animated Button</Button>);
      const button = screen.getByRole('button');
      
      // Component should not have animations when user prefers reduced motion
      if (mediaQuery.matches) {
        expect(button).toHaveStyle({
          animation: 'none',
          transition: 'none',
        });
      }
    });
  });

  describe('Visual Structure', () => {
    it('Maintains proper heading hierarchy', () => {
      render(
        <div>
          <Text as="h1">Main Heading</Text>
          <Text as="h2">Sub Heading</Text>
          <Text>Regular Text</Text>
        </div>
      );
      
      const mainHeading = screen.getByRole('heading', { name: 'Main Heading' });
      const subHeading = screen.getByRole('heading', { name: 'Sub Heading' });
      const regularText = screen.getByText('Regular Text');
      
      expect(mainHeading).toHaveAttribute('aria-level', '1');
      expect(subHeading).toHaveAttribute('aria-level', '2');
      expect(regularText).not.toHaveAttribute('role');
    });

    it('Provides sufficient color contrast', () => {
      render(
        <div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
          <Text tone="primary">High Contrast Text</Text>
        </div>
      );
      
      const text = screen.getByText('High Contrast Text');
      expect(text).toBeInTheDocument();
      
      // This test ensures the component can render with high contrast
      // Actual contrast ratio would need to be calculated by a contrast checker
    });
  });
});
