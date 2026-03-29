/**
 * Auto-generated token types from source token files
 * This file should be regenerated when token files change
 */

// Core token types
export interface CoreTokens {
  color: {
    blue: Record<string, string>;
    gray: Record<string, string>;
    red: Record<string, string>;
    green: Record<string, string>;
    yellow: Record<string, string>;
    orange: Record<string, string>;
    purple: Record<string, string>;
    pink: Record<string, string>;
    white: string;
    black: string;
    transparent: string;
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
    letterSpacing: Record<string, string>;
  };
  radius: Record<string, string>;
  shadow: Record<string, string>;
  border: {
    width: Record<string, string>;
    style: Record<string, string>;
  };
  opacity: Record<string, string>;
  motion: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
  size: Record<string, string>;
  breakpoints: Record<string, string>;
  zIndex: Record<string, string>;
}

// Semantic token types
export interface SemanticTokens {
  color: {
    accent: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    interactive: {
      primary: string;
      primaryHover: string;
      primaryActive: string;
      secondary: string;
      secondaryHover: string;
      secondaryActive: string;
    };
    success: {
      base: string;
      light: string;
      dark: string;
    };
    warning: {
      base: string;
      light: string;
      dark: string;
    };
    danger: {
      base: string;
      light: string;
      dark: string;
    };
    info: {
      base: string;
      light: string;
      dark: string;
    };
    disabled: {
      text: string;
      background: string;
      border: string;
    };
  };
  surface: {
    canvas: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    subtle: {
      primary: string;
      secondary: string;
      accent: string;
    };
    elevated: {
      primary: string;
      secondary: string;
      overlay: string;
    };
    inverse: {
      primary: string;
      secondary: string;
      accent: string;
    };
    interactive: {
      hover: string;
      active: string;
      focus: string;
      selected: string;
    };
    status: {
      success: string;
      warning: string;
      danger: string;
      info: string;
    };
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    subtle: string;
    inverse: string;
    link: string;
    danger: string;
  };
  border: {
    primary: string;
    secondary: string;
    tertiary: string;
    subtle: string;
    strong: string;
    interactive: string;
    error: string;
    focus: string;
  };
  icon: {
    primary: string;
    secondary: string;
    muted: string;
    subtle: string;
    interactive: string;
    inverse: string;
  };
  focus: {
    ring: {
      color: string;
      width: string;
      offset: {
        color: string;
        width: string;
      };
    };
    outline: {
      color: string;
      width: string;
    };
    visible: {
      color: string;
      background: string;
    };
  };
  spacing: {
    stack: Record<string, string>;
    inline: Record<string, string>;
    inset: Record<string, string>;
    gap: Record<string, string>;
  };
  typography: {
    body: Record<string, string>;
    label: Record<string, string>;
    heading: Record<string, string>;
    display: Record<string, string>;
  };
  elevation: {
    resting: string;
    raised: string;
    overlay: string;
    modal: string;
  };
  motion: {
    standard: {
      duration: string;
      easing: string;
    };
    emphasized: {
      duration: string;
      easing: string;
    };
    enterFast: {
      duration: string;
      easing: string;
    };
    exitFast: {
      duration: string;
      easing: string;
    };
  };
}

// Component token types
export interface ComponentTokens {
  button: {
    height: {
      sm: string;
      base: string;
      lg: string;
    };
    padding: {
      sm: {
        horizontal: string;
        vertical: string;
      };
      base: {
        horizontal: string;
        vertical: string;
      };
      lg: {
        horizontal: string;
        vertical: string;
      };
    };
    gap: {
      sm: string;
      base: string;
      lg: string;
    };
    radius: {
      sm: string;
      base: string;
      lg: string;
    };
    border: {
      width: {
        sm: string;
        base: string;
        lg: string;
      };
    };
    shadow: {
      resting: string;
      hover: string;
      active: string;
      focus: string;
    };
    transition: {
      duration: string;
      easing: string;
    };
  };
  card: {
    padding: Record<string, string>;
    radius: Record<string, string>;
    border: Record<string, string>;
    elevation: Record<string, string>;
  };
  input: {
    height: Record<string, string>;
    padding: Record<string, string>;
    radius: Record<string, string>;
    border: Record<string, string>;
    focus: Record<string, string>;
  };
}

// Theme token types
export interface ThemeTokens {
  base: {
    light: Partial<SemanticTokens>;
    dark: Partial<SemanticTokens>;
  };
  brand: {
    firm: Partial<SemanticTokens>;
    platform: Partial<SemanticTokens>;
  };
}

// Exports for CSS generator compatibility
export const semanticTokens: CoreTokens = {} as any;
export const primitiveTokens: CoreTokens = {} as any;
