import { RenderResult } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { expect } from 'vitest';
import { AxeResults } from 'axe-core';

export interface AccessibilityTestOptions {
  componentName?: string;
  skipRules?: string[];
}

/**
 * Test accessibility of a rendered component container
 */
export async function testAccessibility(
  container: HTMLElement,
  options: AccessibilityTestOptions = {}
): Promise<AxeResults> {
  const { componentName } = options;
  
  // Basic axe configuration
  const results = await axe(container);
  
  // Log violations with component context
  if (results.violations.length > 0 && componentName) {
    console.error(
      `Accessibility violations in ${componentName}:`,
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodes: v.nodes.length,
      }))
    );
  }
  
  return results;
}

/**
 * Create an accessibility test function for use in test suites
 */
export function createAccessibilityTest(
  renderFn: () => RenderResult,
  options: AccessibilityTestOptions = {}
) {
  return async () => {
    const { container } = renderFn();
    const results = await testAccessibility(container, options);
    expect(results.violations).toHaveLength(0);
  };
}

/**
 * Test accessibility with specific viewport sizes
 */
export async function testAccessibilityWithViewports(
  renderFn: () => RenderResult,
  viewports: Array<{ width: number; height: number; name: string }> = [
    { width: 320, height: 568, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1024, height: 768, name: 'desktop' },
  ],
  options: AccessibilityTestOptions = {}
): Promise<void> {
  const { componentName } = options;
  
  for (const viewport of viewports) {
    // Mock viewport size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: viewport.width,
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: viewport.height,
    });

    // Re-render for viewport
    const { container } = renderFn();
    const results = await testAccessibility(container, {
      ...options,
      componentName: `${componentName} (${viewport.name} ${viewport.width}x${viewport.height})`,
    });
    
    expect(results.violations).toHaveLength(0);
  }
}

/**
 * Test keyboard navigation for a component
 */
export function testKeyboardNavigation(
  container: HTMLElement,
  keySequence: Array<{ key: string; expected?: string }>
): void {
  keySequence.forEach(({ key, expected }) => {
    const event = new KeyboardEvent('keydown', { key });
    container.dispatchEvent(event);
    
    if (expected) {
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeTruthy();
      expect(focusedElement?.textContent).toContain(expected);
    }
  });
}

/**
 * Common accessibility test configurations
 */
export const accessibilityTestConfigs = {
  // For interactive components
  interactive: {
    skipRules: ['color-contrast'], // Skip if tokens handle contrast
  },
  
  // For decorative components
  decorative: {
    skipRules: ['aria-required-attr', 'aria-required-parent'],
  },
  
  // For form components
  form: {
    skipRules: ['label-title-only'], // May not apply to all form inputs
  },
  
  // For navigation components
  navigation: {
    skipRules: ['keyboard-navigation'], // May need custom testing
  },
} as const;
