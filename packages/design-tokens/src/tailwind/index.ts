/**
 * Tailwind CSS v4 Bridge
 * Provides seamless integration between design tokens and Tailwind CSS v4
 * Generates Tailwind-compatible CSS custom properties and configuration
 */

// Make Tailwind types optional
type TailwindConfig = {
  darkMode?: string;
  theme?: {
    extend?: Record<string, any>;
  };
};

// =============================================================================
// TAILWIND TOKEN MAPPING
// =============================================================================

export interface TailwindTokenMapping {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  fontSize: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
  zIndex: Record<string, string>;
  screens: Record<string, string>;
}

/**
 * Generate Tailwind v4 compatible token mapping from design tokens
 */
export function generateTailwindMapping(): TailwindTokenMapping {
  return {
    colors: {
      // Core colors
      'blue-50': 'var(--repo-core-color-blue-50)',
      'blue-100': 'var(--repo-core-color-blue-100)',
      'blue-200': 'var(--repo-core-color-blue-200)',
      'blue-300': 'var(--repo-core-color-blue-300)',
      'blue-400': 'var(--repo-core-color-blue-400)',
      'blue-500': 'var(--repo-core-color-blue-500)',
      'blue-600': 'var(--repo-core-color-blue-600)',
      'blue-700': 'var(--repo-core-color-blue-700)',
      'blue-800': 'var(--repo-core-color-blue-800)',
      'blue-900': 'var(--repo-core-color-blue-900)',
      'blue-950': 'var(--repo-core-color-blue-950)',
      
      'gray-50': 'var(--repo-core-color-gray-50)',
      'gray-100': 'var(--repo-core-color-gray-100)',
      'gray-200': 'var(--repo-core-color-gray-200)',
      'gray-300': 'var(--repo-core-color-gray-300)',
      'gray-400': 'var(--repo-core-color-gray-400)',
      'gray-500': 'var(--repo-core-color-gray-500)',
      'gray-600': 'var(--repo-core-color-gray-600)',
      'gray-700': 'var(--repo-core-color-gray-700)',
      'gray-800': 'var(--repo-core-color-gray-800)',
      'gray-900': 'var(--repo-core-color-gray-900)',
      'gray-950': 'var(--repo-core-color-gray-950)',
      
      'red-50': 'var(--repo-core-color-red-50)',
      'red-100': 'var(--repo-core-color-red-100)',
      'red-500': 'var(--repo-core-color-red-500)',
      'red-600': 'var(--repo-core-color-red-600)',
      'red-700': 'var(--repo-core-color-red-700)',
      
      'green-50': 'var(--repo-core-color-green-50)',
      'green-100': 'var(--repo-core-color-green-100)',
      'green-500': 'var(--repo-core-color-green-500)',
      'green-600': 'var(--repo-core-color-green-600)',
      'green-700': 'var(--repo-core-color-green-700)',
      
      'yellow-50': 'var(--repo-core-color-yellow-50)',
      'yellow-100': 'var(--repo-core-color-yellow-100)',
      'yellow-500': 'var(--repo-core-color-yellow-500)',
      'yellow-600': 'var(--repo-core-color-yellow-600)',
      'yellow-700': 'var(--repo-core-color-yellow-700)',
      
      'orange-50': 'var(--repo-core-color-orange-50)',
      'orange-100': 'var(--repo-core-color-orange-100)',
      'orange-500': 'var(--repo-core-color-orange-500)',
      'orange-600': 'var(--repo-core-color-orange-600)',
      'orange-700': 'var(--repo-core-color-orange-700)',
      
      'purple-50': 'var(--repo-core-color-purple-50)',
      'purple-100': 'var(--repo-core-color-purple-100)',
      'purple-500': 'var(--repo-core-color-purple-500)',
      'purple-600': 'var(--repo-core-color-purple-600)',
      'purple-700': 'var(--repo-core-color-purple-700)',
      
      'pink-50': 'var(--repo-core-color-pink-50)',
      'pink-100': 'var(--repo-core-color-pink-100)',
      'pink-500': 'var(--repo-core-color-pink-500)',
      'pink-600': 'var(--repo-core-color-pink-600)',
      'pink-700': 'var(--repo-core-color-pink-700)',
      
      'white': 'var(--repo-core-color-white)',
      'black': 'var(--repo-core-color-black)',
      'transparent': 'var(--repo-core-color-transparent)',
      
      // Semantic colors
      'primary': 'var(--repo-semantic-color-accent-primary)',
      'secondary': 'var(--repo-semantic-color-accent-secondary)',
      'accent': 'var(--repo-semantic-color-accent-tertiary)',
      'success': 'var(--repo-semantic-color-success-base)',
      'warning': 'var(--repo-semantic-color-warning-base)',
      'error': 'var(--repo-semantic-color-danger-base)',
      'info': 'var(--repo-semantic-color-info-base)',
      
      // Surface colors
      'surface': 'var(--repo-semantic-surface-canvas-primary)',
      'surface-variant': 'var(--repo-semantic-surface-subtle-primary)',
      'background': 'var(--repo-semantic-surface-canvas-primary)',
      'background-variant': 'var(--repo-semantic-surface-subtle-primary)',
      
      // Text colors
      'foreground': 'var(--repo-semantic-text-primary)',
      'foreground-variant': 'var(--repo-semantic-text-secondary)',
      'muted': 'var(--repo-semantic-text-muted)',
      'muted-foreground': 'var(--repo-semantic-text-subtle)',
      
      // Border colors
      'border': 'var(--repo-semantic-border-primary)',
      'border-variant': 'var(--repo-semantic-border-secondary)',
      'border-muted': 'var(--repo-semantic-border-subtle)',
    },
    
    spacing: {
      '0': 'var(--repo-core-spacing-0)',
      'px': 'var(--repo-core-spacing-px)',
      '0.5': 'var(--repo-core-spacing-0_5)',
      '1': 'var(--repo-core-spacing-1)',
      '1.5': 'var(--repo-core-spacing-1_5)',
      '2': 'var(--repo-core-spacing-2)',
      '2.5': 'var(--repo-core-spacing-2_5)',
      '3': 'var(--repo-core-spacing-3)',
      '3.5': 'var(--repo-core-spacing-3_5)',
      '4': 'var(--repo-core-spacing-4)',
      '5': 'var(--repo-core-spacing-5)',
      '6': 'var(--repo-core-spacing-6)',
      '7': 'var(--repo-core-spacing-7)',
      '8': 'var(--repo-core-spacing-8)',
      '9': 'var(--repo-core-spacing-9)',
      '10': 'var(--repo-core-spacing-10)',
      '11': 'var(--repo-core-spacing-11)',
      '12': 'var(--repo-core-spacing-12)',
      '14': 'var(--repo-core-spacing-14)',
      '16': 'var(--repo-core-spacing-16)',
      '20': 'var(--repo-core-spacing-20)',
      '24': 'var(--repo-core-spacing-24)',
      '28': 'var(--repo-core-spacing-28)',
      '32': 'var(--repo-core-spacing-32)',
      '36': 'var(--repo-core-spacing-36)',
      '40': 'var(--repo-core-spacing-40)',
      '44': 'var(--repo-core-spacing-44)',
      '48': 'var(--repo-core-spacing-48)',
      '52': 'var(--repo-core-spacing-52)',
      '56': 'var(--repo-core-spacing-56)',
      '60': 'var(--repo-core-spacing-60)',
      '64': 'var(--repo-core-spacing-64)',
      '72': 'var(--repo-core-spacing-72)',
      '80': 'var(--repo-core-spacing-80)',
      '96': 'var(--repo-core-spacing-96)',
    },
    
    fontSize: {
      'xs': 'var(--repo-core-font-size-xs)',
      'sm': 'var(--repo-core-font-size-sm)',
      'base': 'var(--repo-core-font-size-base)',
      'lg': 'var(--repo-core-font-size-lg)',
      'xl': 'var(--repo-core-font-size-xl)',
      '2xl': 'var(--repo-core-font-size-2xl)',
      '3xl': 'var(--repo-core-font-size-3xl)',
      '4xl': 'var(--repo-core-font-size-4xl)',
      '5xl': 'var(--repo-core-font-size-5xl)',
      '6xl': 'var(--repo-core-font-size-6xl)',
    },
    
    fontWeight: {
      'thin': 'var(--repo-core-font-weight-thin)',
      'light': 'var(--repo-core-font-weight-light)',
      'normal': 'var(--repo-core-font-weight-normal)',
      'medium': 'var(--repo-core-font-weight-medium)',
      'semibold': 'var(--repo-core-font-weight-semibold)',
      'bold': 'var(--repo-core-font-weight-bold)',
      'extrabold': 'var(--repo-core-font-weight-extrabold)',
      'black': 'var(--repo-core-font-weight-black)',
    },
    
    lineHeight: {
      'none': 'var(--repo-core-line-height-none)',
      'tight': 'var(--repo-core-line-height-tight)',
      'snug': 'var(--repo-core-line-height-snug)',
      'normal': 'var(--repo-core-line-height-normal)',
      'relaxed': 'var(--repo-core-line-height-relaxed)',
      'loose': 'var(--repo-core-line-height-loose)',
    },
    
    borderRadius: {
      'none': 'var(--repo-core-radius-none)',
      'sm': 'var(--repo-core-radius-sm)',
      'base': 'var(--repo-core-radius-base)',
      'md': 'var(--repo-core-radius-md)',
      'lg': 'var(--repo-core-radius-lg)',
      'xl': 'var(--repo-core-radius-xl)',
      '2xl': 'var(--repo-core-radius-2xl)',
      '3xl': 'var(--repo-core-radius-3xl)',
      'full': 'var(--repo-core-radius-full)',
    },
    
    boxShadow: {
      'sm': 'var(--repo-core-shadow-sm)',
      'base': 'var(--repo-core-shadow-base)',
      'md': 'var(--repo-core-shadow-md)',
      'lg': 'var(--repo-core-shadow-lg)',
      'xl': 'var(--repo-core-shadow-xl)',
      '2xl': 'var(--repo-core-shadow-2xl)',
      'inner': 'var(--repo-core-shadow-inner)',
      'none': 'var(--repo-core-shadow-none)',
    },
    
    zIndex: {
      '0': 'var(--repo-core-z-index-0)',
      '10': 'var(--repo-core-z-index-10)',
      '20': 'var(--repo-core-z-index-20)',
      '30': 'var(--repo-core-z-index-30)',
      '40': 'var(--repo-core-z-index-40)',
      '50': 'var(--repo-core-z-index-50)',
      'auto': 'var(--repo-core-z-index-auto)',
    },
    
    screens: {
      'sm': 'var(--repo-core-breakpoint-sm)',
      'md': 'var(--repo-core-breakpoint-md)',
      'lg': 'var(--repo-core-breakpoint-lg)',
      'xl': 'var(--repo-core-breakpoint-xl)',
      '2xl': 'var(--repo-core-breakpoint-2xl)',
    },
  };
}

// =============================================================================
// TAILWIND CONFIGURATION GENERATOR
// =============================================================================

/**
 * Generate Tailwind CSS v4 configuration using design tokens
 */
export function generateTailwindConfig(): Omit<TailwindConfig, 'plugins' | 'content'> {
  const tokenMapping = generateTailwindMapping();
  
  return {
    darkMode: 'class',
    theme: {
      extend: {
        colors: tokenMapping.colors,
        spacing: tokenMapping.spacing,
        fontSize: tokenMapping.fontSize,
        fontWeight: tokenMapping.fontWeight,
        lineHeight: tokenMapping.lineHeight,
        borderRadius: tokenMapping.borderRadius,
        boxShadow: tokenMapping.boxShadow,
        zIndex: tokenMapping.zIndex,
        screens: tokenMapping.screens,
        
        // Extend with semantic tokens for better naming
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          serif: ['Georgia', 'Cambria', 'serif'],
          mono: ['SF Mono', 'Monaco', 'monospace'],
        },
        
        // Animation durations from motion tokens
        transitionDuration: {
          '75': '75ms',
          '100': '100ms',
          '150': '150ms',
          '200': '200ms',
          '300': '300ms',
          '500': '500ms',
          '700': '700ms',
          '1000': '1000ms',
        },
        
        // Animation easing functions
        transitionTimingFunction: {
          'linear': 'linear',
          'in': 'cubic-bezier(0.4, 0, 1, 1)',
          'out': 'cubic-bezier(0, 0, 0.2, 1)',
          'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
  };
}

// =============================================================================
// CSS GENERATION FOR TAILWIND
// =============================================================================

/**
 * Generate Tailwind-compatible CSS from design tokens
 */
export function generateTailwindCSS(): string {
  const tokenMapping = generateTailwindMapping();
  let css = `/* 
 * Tailwind CSS v4 Bridge - Design Tokens Integration
 * Generated: ${new Date().toISOString()}
 * Framework: Tailwind CSS v4 Compatible
 */

/* Design Token Variables */
:root {
`;

  // Add all token variables
  Object.entries(tokenMapping.colors).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`;
  });
  
  Object.entries(tokenMapping.spacing).forEach(([key, value]) => {
    css += `  --${key}: ${value};\n`;
  });
  
  css += `}\n\n`;

  // Add @property rules for better performance
  css += `/* CSS @property Rules for Performance */\n`;
  
  Object.entries(tokenMapping.colors).forEach(([key, value]) => {
    css += `@property --${key} {\n`;
    css += `  syntax: '<color>';\n`;
    css += `  inherits: true;\n`;
    css += `  initial-value: ${value};\n`;
    css += `}\n\n`;
  });

  return css;
}

// =============================================================================
// TAILWIND THEME SWITCHING UTILITIES
// =============================================================================

/**
 * Generate CSS for theme switching with Tailwind
 */
export function generateTailwindThemeCSS(): string {
  return `/* 
 * Tailwind Theme Switching Utilities
 * Generated: ${new Date().toISOString()}
 */

/* Dark theme overrides */
.dark {
  color-scheme: dark;
}

/* Theme-specific token overrides */
[data-theme="dark"] {
  /* Dark theme semantic overrides would go here */
}

[data-brand="firm"] {
  /* Firm brand overrides would go here */
}

[data-brand="platform"] {
  /* Platform brand overrides would go here */
}

/* Theme transition utilities */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
`;
}

// =============================================================================
// EXPORTS
// =============================================================================

export const tailwindMapping = generateTailwindMapping();
export const tailwindConfig = generateTailwindConfig();

// Re-export utilities
export { generateTailwindMapping as createMapping };
export { generateTailwindConfig as createConfig };
export { generateTailwindCSS as createCSS };
export { generateTailwindThemeCSS as createThemeCSS };
