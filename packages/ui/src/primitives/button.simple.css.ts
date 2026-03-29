// Simple CSS-in-JS without vanilla-extract for testing
export const buttonVariants = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none',
    borderRadius: '0.25rem',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: '500',
    lineHeight: '1.25',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 150ms',
  },
  sizes: {
    xs: {
      fontSize: '0.75rem',
      padding: '0.25rem 0.5rem',
      minHeight: '24px',
    },
    sm: {
      fontSize: '0.875rem',
      padding: '0.5rem 1rem',
      minHeight: '32px',
    },
    md: {
      fontSize: '1rem',
      padding: '1rem 1.5rem',
      minHeight: '40px',
    },
    lg: {
      fontSize: '1.125rem',
      padding: '1.5rem 2rem',
      minHeight: '48px',
    },
    xl: {
      fontSize: '1.25rem',
      padding: '2rem 3rem',
      minHeight: '56px',
    },
  },
  tones: {
    neutral: {
      backgroundColor: '#ffffff',
      color: '#111827',
    },
    primary: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#3b82f6',
      border: '1px solid #3b82f6',
    },
    accent: {
      backgroundColor: '#60a5fa',
      color: '#111827',
    },
    success: {
      backgroundColor: '#10b981',
      color: '#ffffff',
    },
    warning: {
      backgroundColor: '#f59e0b',
      color: '#111827',
    },
    error: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
    },
  },
  variants: {
    solid: {},
    outline: {
      backgroundColor: 'transparent',
      borderWidth: '1px',
      borderStyle: 'solid',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    link: {
      backgroundColor: 'transparent',
      border: 'none',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
  },
};
