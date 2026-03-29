/**
 * CSS theme utilities
 * Provides theme switching and brand variant utilities
 */

/**
 * Set theme on HTML element
 */
export function setTheme(theme: 'light' | 'dark') {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

/**
 * Set brand on HTML element
 */
export function setBrand(brand: 'firm' | 'platform') {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-brand', brand);
  }
}

/**
 * Get current theme
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
  }
  return 'light';
}

/**
 * Get current brand
 */
export function getCurrentBrand(): 'firm' | 'platform' | null {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('data-brand') as 'firm' | 'platform' | null;
  }
  return null;
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme() {
  const currentTheme = getCurrentTheme();
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

/**
 * Apply theme and brand together
 */
export function applyTheme(theme: 'light' | 'dark', brand?: 'firm' | 'platform') {
  setTheme(theme);
  if (brand) {
    setBrand(brand);
  }
}
