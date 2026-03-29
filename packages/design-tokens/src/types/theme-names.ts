/**
 * Theme name constants and definitions
 */

export const THEME_NAMES = {
  // Base themes
  LIGHT: 'light',
  DARK: 'dark',
  
  // Brand themes
  FIRM: 'firm',
  PLATFORM: 'platform',
  
  // Theme selectors
  DEFAULT: 'default',
  SYSTEM: 'system'
} as const;

export const THEME_SELECTORS = {
  LIGHT: ':root',
  DARK: 'html[data-theme="dark"]',
  FIRM: 'html[data-brand="firm"]',
  PLATFORM: 'html[data-brand="platform"]',
  LIGHT_DATA: 'html[data-theme="light"]'
} as const;

export const THEME_COMBINATIONS = [
  'light',
  'dark',
  'light-firm',
  'dark-firm', 
  'light-platform',
  'dark-platform'
] as const;
