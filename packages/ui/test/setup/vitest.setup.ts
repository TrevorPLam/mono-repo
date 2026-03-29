import '@testing-library/jest-dom';
import { axe, configureAxe } from 'vitest-axe';
import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Configure axe for accessibility testing
beforeAll(() => {
  configureAxe({
    rules: {
      // Disable rules that are not applicable to component testing
      'landmark-one-main': { enabled: false },
      'page-has-heading-one': { enabled: false },
      'region': { enabled: false },
    },
  });
});

// Custom matcher for accessibility testing
expect.extend({
  async toHaveNoAxeViolations(container: HTMLElement) {
    const results = await axe(container);
    const pass = results.violations.length === 0;
    
    return {
      pass,
      message: () => {
        if (pass) {
          return 'Expected to have accessibility violations, but none found';
        }
        
        const violations = results.violations.map(violation => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
        }));
        
        return `Found ${results.violations.length} accessibility violation(s):\n${
          violations.map(v => `- ${v.id} (${v.impact}): ${v.description}`).join('\n')
        }`;
      },
    };
  },
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Add TypeScript declarations for global mocks
declare global {
  interface Window {
    IntersectionObserver: typeof IntersectionObserver;
    ResizeObserver: typeof ResizeObserver;
    matchMedia: (query: string) => MediaQueryList;
  }
}
