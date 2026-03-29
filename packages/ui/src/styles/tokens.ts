// Simple token structure for testing - will be enhanced with vanilla-extract integration
export const tokens = {
  colors: {
    blue: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      500: '#6b7280',
      900: '#111827',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    'xxl': '4rem',
  },
  sizing: {
    xs: '1rem',
    sm: '1.25rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
  },
  typography: {
    fontFamily: {
      body: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif',
      mono: 'ui-monospace, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  zIndex: {
    base: '0',
    raised: '10',
    dropdown: '1000',
    modal: '1050',
    toast: '1100',
  },
};

// Token categories for easy access - matching expected structure
export const colors = {
  ...tokens.colors,
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    muted: '#f3f4f6',
    accent: '#3b82f6',
    inverse: '#111827',
  },
  foreground: {
    primary: '#111827',
    secondary: '#6b7280',
    muted: '#9ca3af',
    accent: '#3b82f6',
    inverse: '#ffffff',
  },
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    muted: '#e5e7eb',
    accent: '#3b82f6',
    inverse: '#374151',
  },
  brand: {
    primary: '#3b82f6',
    secondary: '#1d4ed8',
    accent: '#60a5fa',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

export const typography = tokens.typography;
export const spacing = tokens.spacing;
export const sizing = {
  xs: '1rem',
  sm: '1.25rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '2.5rem',
};

export const borderRadius = tokens.borderRadius;
export const shadows = tokens.shadows;
export const transitions = tokens.transitions;
export const zIndex = tokens.zIndex;

// Semantic token mappings
export const semanticColors = {
  background: {
    primary: colors.background?.primary || '#ffffff',
    secondary: colors.background?.secondary || '#f9fafb',
    muted: colors.background?.muted || '#f3f4f6',
    accent: colors.background?.accent || '#3b82f6',
    inverse: colors.background?.inverse || '#111827',
  },
  foreground: {
    primary: colors.foreground?.primary || '#111827',
    secondary: colors.foreground?.secondary || '#6b7280',
    muted: colors.foreground?.muted || '#9ca3af',
    accent: colors.foreground?.accent || '#3b82f6',
    inverse: colors.foreground?.inverse || '#ffffff',
  },
  border: {
    primary: colors.border?.primary || '#e5e7eb',
    secondary: colors.border?.secondary || '#d1d5db',
    muted: colors.border?.muted || '#e5e7eb',
    accent: colors.border?.accent || '#3b82f6',
    inverse: colors.border?.inverse || '#374151',
  },
  brand: {
    primary: colors.brand?.primary || '#3b82f6',
    secondary: colors.brand?.secondary || '#1d4ed8',
    accent: colors.brand?.accent || '#60a5fa',
  },
  status: {
    success: colors.status?.success || '#10b981',
    warning: colors.status?.warning || '#f59e0b',
    error: colors.status?.error || '#ef4444',
    info: colors.status?.info || '#3b82f6',
  },
};
