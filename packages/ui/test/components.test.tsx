import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Button, Input, Box, Text, Icon } from '../src';
import { createAccessibilityTest } from './accessibility/test-utils';

describe('Core Primitive Components', () => {
  describe('Button', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('applies variant and size props', () => {
      render(<Button variant="outline" size="lg">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('handles disabled state', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('shows loading state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('handles click events with userEvent', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      
      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard navigation', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Input', () => {
    it('renders with default props', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });

    it('handles different input types', () => {
      render(<Input type="email" />);
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('applies validation states', () => {
      render(<Input state="error" />);
      const input = screen.getByDisplayValue('');
      expect(input).toBeInTheDocument();
    });

    it('handles user input with userEvent', async () => {
      render(<Input placeholder="Type here" />);
      const input = screen.getByPlaceholderText('Type here');
      
      await userEvent.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('handles focus and blur events', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
      const input = screen.getByDisplayValue('');
      
      await userEvent.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await userEvent.tab(); // Move focus away
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Input placeholder="Enter text" />);
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Box', () => {
    it('renders with basic props', () => {
      render(<Box data-testid="test-box">Box content</Box>);
      const box = screen.getByTestId('test-box');
      expect(box).toBeInTheDocument();
      expect(box).toHaveTextContent('Box content');
    });

    it('applies layout props', () => {
      render(
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          data-testid="flex-box"
        >
          Flex content
        </Box>
      );
      const box = screen.getByTestId('flex-box');
      expect(box).toBeInTheDocument();
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Box>Box content</Box>);
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Text', () => {
    it('renders with default props', () => {
      render(<Text>Hello World</Text>);
      const text = screen.getByText('Hello World');
      expect(text).toBeInTheDocument();
    });

    it('applies typography props', () => {
      render(
        <Text 
          as="h1" 
          size="xl" 
          weight="bold"
          tone="primary"
        >
          Heading
        </Text>
      );
      const heading = screen.getByText('Heading');
      expect(heading).toBeInTheDocument();
    });

    it('handles text truncation', () => {
      render(
        <Text truncate>
          This is a very long text that should be truncated
        </Text>
      );
      const text = screen.getByText(/This is a very long text/);
      expect(text).toBeInTheDocument();
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Text>Hello World</Text>);
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Icon', () => {
    it('renders with default props', () => {
      render(
        <Icon data-testid="test-icon">
          <circle cx="12" cy="12" r="10" />
        </Icon>
      );
      const icon = screen.getByTestId('test-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('role', 'img');
    });

    it('applies size and color props', () => {
      render(
        <Icon 
          size="lg" 
          color="primary" 
          data-testid="styled-icon"
        >
          <circle cx="12" cy="12" r="10" />
        </Icon>
      );
      const icon = screen.getByTestId('styled-icon');
      expect(icon).toBeInTheDocument();
    });

    it('handles decorative icons', () => {
      render(
        <Icon decorative data-testid="decorative-icon">
          <circle cx="12" cy="12" r="10" />
        </Icon>
      );
      const icon = screen.getByTestId('decorative-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('handles labeled icons', () => {
      render(
        <Icon label="Close icon" data-testid="labeled-icon">
          <circle cx="12" cy="12" r="10" />
        </Icon>
      );
      const icon = screen.getByTestId('labeled-icon');
      expect(icon).toHaveAttribute('aria-label', 'Close icon');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <Icon label="Test icon">
          <circle cx="12" cy="12" r="10" />
        </Icon>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });
  });
});
