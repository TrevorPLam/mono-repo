/**
 * CSS theme selectors
 * Provides selectors for theme switching and brand variants
 */

export const selectors = {
  // Theme selectors
  theme: {
    light: 'html[data-theme="light"]',
    dark: 'html[data-theme="dark"]',
  },
  
  // Brand selectors
  brand: {
    firm: 'html[data-brand="firm"]',
    platform: 'html[data-brand="platform"]',
  },
  
  // Combined selectors
  combined: {
    darkFirm: 'html[data-theme="dark"][data-brand="firm"]',
    darkPlatform: 'html[data-theme="dark"][data-brand="platform"]',
    lightFirm: 'html[data-theme="light"][data-brand="firm"]',
    lightPlatform: 'html[data-theme="light"][data-brand="platform"]',
  },
  
  // Root selector
  root: ':root',
} as const;
