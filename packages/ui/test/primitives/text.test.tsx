import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Text } from '../../src/primitives';

describe('Text Primitive', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('Rendering', () => {
    it('renders with minimal props', () => {
      render(<Text>Hello World</Text>);
      const text = screen.getByText('Hello World');
      expect(text).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Text className="custom-text">Styled Text</Text>);
      const text = screen.getByText('Styled Text');
      expect(text).toHaveClass('custom-text');
    });

    it('renders with test id', () => {
      render(<Text testId="test-text">Test Text</Text>);
      const text = screen.getByTestId('test-text');
      expect(text).toBeInTheDocument();
    });

    it('renders as span by default', () => {
      render(<Text>Default Text</Text>);
      const text = screen.getByText('Default Text');
      expect(text.tagName).toBe('SPAN');
    });

    it('renders as different HTML tag', () => {
      render(<Text as="h1">Heading Text</Text>);
      const text = screen.getByText('Heading Text');
      expect(text.tagName).toBe('H1');
    });
  });

  describe('Typography Props', () => {
    it('applies size sm', () => {
      render(<Text size="sm">Small Text</Text>);
      const text = screen.getByText('Small Text');
      expect(text).toHaveClass(/.*sm.*/);
    });

    it('applies size md', () => {
      render(<Text size="md">Medium Text</Text>);
      const text = screen.getByText('Medium Text');
      expect(text).toHaveClass(/.*md.*/);
    });

    it('applies size lg', () => {
      render(<Text size="lg">Large Text</Text>);
      const text = screen.getByText('Large Text');
      expect(text).toHaveClass(/.*lg.*/);
    });

    it('applies size xl', () => {
      render(<Text size="xl">Extra Large Text</Text>);
      const text = screen.getByText('Extra Large Text');
      expect(text).toHaveClass(/.*xl.*/);
    });

    it('applies bold weight', () => {
      render(<Text weight="bold">Bold Text</Text>);
      const text = screen.getByText('Bold Text');
      expect(text).toHaveClass(/.*bold.*/);
    });

    it('applies semibold weight', () => {
      render(<Text weight="semibold">Semibold Text</Text>);
      const text = screen.getByText('Semibold Text');
      expect(text).toHaveClass(/.*semibold.*/);
    });

    it('applies normal weight', () => {
      render(<Text weight="normal">Normal Text</Text>);
      const text = screen.getByText('Normal Text');
      expect(text).toHaveClass(/.*normal.*/);
    });

    it('applies light weight', () => {
      render(<Text weight="light">Light Text</Text>);
      const text = screen.getByText('Light Text');
      expect(text).toHaveClass(/.*light.*/);
    });

    it('applies primary tone', () => {
      render(<Text tone="primary">Primary Text</Text>);
      const text = screen.getByText('Primary Text');
      expect(text).toHaveClass(/.*primary.*/);
    });

    it('applies secondary tone', () => {
      render(<Text tone="secondary">Secondary Text</Text>);
      const text = screen.getByText('Secondary Text');
      expect(text).toHaveClass(/.*secondary.*/);
    });

    it('applies accent tone', () => {
      render(<Text tone="accent">Accent Text</Text>);
      const text = screen.getByText('Accent Text');
      expect(text).toHaveClass(/.*accent.*/);
    });
  });

  describe('Text Features', () => {
    it('supports text truncation', () => {
      render(
        <div style={{ width: '100px' }}>
          <Text truncate>This is a very long text that should be truncated when the truncate prop is used</Text>
        </div>
      );
      
      const text = screen.getByText(/This is a very long text/);
      expect(text).toBeInTheDocument();
      
      // Check if truncation styles are applied (implementation dependent)
      expect(text).toHaveClass(/.*truncate.*/);
    });

    it('renders children correctly', () => {
      render(
        <Text>
          <span data-testid="text-child">Child content</span>
          <span data-testid="text-child-2">More content</span>
        </Text>
      );
      
      const text = screen.getByText('Child contentMore content');
      const child1 = screen.getByTestId('text-child');
      const child2 = screen.getByTestId('text-child-2');
      
      expect(text).toBeInTheDocument();
      expect(child1).toBeInTheDocument();
      expect(child2).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Text ref={ref}>Ref Test</Text>);
      
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveTextContent('Ref Test');
    });
  });

  describe('Accessibility', () => {
    it('has no semantic role by default', () => {
      render(<Text>Regular Text</Text>);
      const text = screen.getByText('Regular Text');
      expect(text).not.toHaveAttribute('role');
    });

    it('has heading role when as heading', () => {
      render(<Text as="h1">Heading</Text>);
      const text = screen.getByRole('heading');
      expect(text).toHaveAttribute('role', 'heading');
      expect(text).toHaveAttribute('aria-level', '1');
    });

    it('supports screen reader friendly content', () => {
      render(<Text>Accessible Text</Text>);
      const text = screen.getByText('Accessible Text');
      expect(text).toBeInTheDocument();
    });
  });
});
