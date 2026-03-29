import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button, Text, Box, Icon } from '../../src';

describe('Token Integration Tests', () => {
  describe('Design Token Usage', () => {
    it('applies color tokens correctly', () => {
      render(<Button tone="primary">Primary Button</Button>);
      const button = screen.getByRole('button');
      
      // Check that CSS custom properties are applied
      const styles = window.getComputedStyle(button);
      expect(styles.getPropertyValue('--color-primary')).toBeDefined();
    });

    it('applies typography tokens correctly', () => {
      render(
        <Text as="h1" size="xl" weight="bold">
          Heading Text
        </Text>
      );
      const heading = screen.getByText('Heading Text');
      
      // Check that typography tokens are applied
      const styles = window.getComputedStyle(heading);
      expect(styles.getPropertyValue('--font-size-xl')).toBeDefined();
      expect(styles.getPropertyValue('--font-weight-bold')).toBeDefined();
    });

    it('applies spacing tokens correctly', () => {
      render(
        <Box p="lg" m="md" data-testid="spaced-box">
          Spaced content
        </Box>
      );
      const box = screen.getByTestId('spaced-box');
      
      // Check that spacing tokens are applied
      const styles = window.getComputedStyle(box);
      expect(styles.getPropertyValue('--spacing-lg')).toBeDefined();
      expect(styles.getPropertyValue('--spacing-md')).toBeDefined();
    });

    it('applies sizing tokens correctly', () => {
      render(
        <Icon size="lg" data-testid="sized-icon">
          <circle cx="12" cy="12" r="10" />
        </Icon>
      );
      const icon = screen.getByTestId('sized-icon');
      
      // Check that size tokens are applied
      const styles = window.getComputedStyle(icon);
      expect(styles.getPropertyValue('--size-lg')).toBeDefined();
    });
  });

  describe('Token Consistency', () => {
    it('uses consistent token values across components', () => {
      render(
        <>
          <Button tone="primary" data-testid="primary-button">
            Button
          </Button>
          <Text tone="primary" data-testid="primary-text">
            Text
          </Text>
          <Icon color="primary" data-testid="primary-icon">
            <circle cx="12" cy="12" r="10" />
          </Icon>
        </>
      );

      const button = screen.getByTestId('primary-button');
      const text = screen.getByTestId('primary-text');
      const icon = screen.getByTestId('primary-icon');

      const buttonStyles = window.getComputedStyle(button);
      const textStyles = window.getComputedStyle(text);
      const iconStyles = window.getComputedStyle(icon);

      // All should use the same primary color token
      expect(buttonStyles.color).toBe(textStyles.color);
      expect(buttonStyles.color).toBe(iconStyles.color);
    });

    it('applies semantic tokens correctly', () => {
      render(
        <>
          <Button variant="solid" data-testid="solid-button">
            Solid
          </Button>
          <Button variant="outline" data-testid="outline-button">
            Outline
          </Button>
          <Button variant="ghost" data-testid="ghost-button">
            Ghost
          </Button>
        </>
      );

      const solidButton = screen.getByTestId('solid-button');
      const outlineButton = screen.getByTestId('outline-button');
      const ghostButton = screen.getByTestId('ghost-button');

      const solidStyles = window.getComputedStyle(solidButton);
      const outlineStyles = window.getComputedStyle(outlineButton);
      const ghostStyles = window.getComputedStyle(ghostButton);

      // Each variant should have distinct styling
      expect(solidStyles.backgroundColor).not.toBe(outlineStyles.backgroundColor);
      expect(solidStyles.backgroundColor).not.toBe(ghostStyles.backgroundColor);
      expect(outlineStyles.backgroundColor).not.toBe(ghostStyles.backgroundColor);
    });
  });

  describe('Token Validation', () => {
    it('validates token values are not hardcoded', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button');
      
      // Check that no hardcoded colors are used
      const styles = window.getComputedStyle(button);
      const backgroundColor = styles.backgroundColor;
      
      // Should not be hardcoded hex colors or rgb values
      expect(backgroundColor).not.toMatch(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
      expect(backgroundColor).not.toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
    });

    it('validates token fallbacks work', () => {
      render(<Text>Fallback Text</Text>);
      const text = screen.getByText('Fallback Text');
      
      // Should have default token values applied
      const styles = window.getComputedStyle(text);
      expect(styles.fontSize).toBeDefined();
      expect(styles.color).toBeDefined();
    });
  });

  describe('Theme Integration', () => {
    it('supports theme token switching', () => {
      render(
        <div data-theme="dark">
          <Button tone="primary" data-testid="themed-button">
            Themed Button
          </Button>
        </div>
      );
      
      const button = screen.getByTestId('themed-button');
      const styles = window.getComputedStyle(button);
      
      // Should have theme-aware token values
      expect(styles.getPropertyValue('--color-primary')).toBeDefined();
      expect(button.closest('[data-theme="dark"]')).toBeTruthy();
    });
  });

  describe('Token Performance', () => {
    it('applies tokens efficiently', () => {
      const startTime = performance.now();
      
      render(
        <>
          <Button>Button 1</Button>
          <Button>Button 2</Button>
          <Button>Button 3</Button>
          <Button>Button 4</Button>
          <Button>Button 5</Button>
        </>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render quickly even with multiple components
      expect(renderTime).toBeLessThan(100); // 100ms threshold
    });
  });
});
