/**
 * Theme Switching Utilities
 * Runtime theme switching mechanisms for web applications
 * Supports CSS custom properties updates and smooth transitions
 */

import { themeRegistry, tokenResolver, type ThemeResolutionContext } from './index';

// =============================================================================
// CSS CUSTOM PROPERTIES UPDATER
// =============================================================================

export interface ThemeSwitchOptions {
  /** Enable smooth transitions during theme switch */
  enableTransitions?: boolean;
  /** Transition duration in milliseconds */
  transitionDuration?: number;
  /** Theme to apply after switching */
  targetTheme?: string;
  /** Brand customization overrides */
  brandOverrides?: Record<string, any>;
  /** Callback function when theme switch completes */
  onComplete?: () => void;
  /** Callback function when theme switch fails */
  onError?: (error: Error) => void;
}

/**
 * Theme Switcher - Handles runtime theme switching with CSS custom properties
 */
export class ThemeSwitcher {
  private rootElement: HTMLElement;
  private currentTheme: string = 'default';
  private transitionTimeout: number | null = null;

  constructor(rootElement: HTMLElement = document.documentElement) {
    this.rootElement = rootElement;
  }

  /**
   * Switch to a new theme
   */
  async switchTheme(themeId: string, options: ThemeSwitchOptions = {}): Promise<void> {
    const {
      enableTransitions = true,
      transitionDuration = 300,
      targetTheme,
      brandOverrides,
      onComplete,
      onError
    } = options;

    try {
      // Validate theme exists
      const theme = themeRegistry.getTheme(themeId);
      if (!theme) {
        throw new Error(`Theme "${themeId}" not found in registry`);
      }

      // Clear any existing transition timeout
      if (this.transitionTimeout) {
        clearTimeout(this.transitionTimeout);
        this.transitionTimeout = null;
      }

      // Set up transitions if enabled
      if (enableTransitions) {
        this.setupTransitions(transitionDuration);
      }

      // Update token resolver
      tokenResolver.setTheme(themeId);
      if (brandOverrides) {
        tokenResolver.setBrandOverrides(brandOverrides);
      }

      // Apply theme to DOM
      await this.applyThemeToDOM(themeId, brandOverrides);

      // Update current theme
      this.currentTheme = themeId;

      // Apply target theme if specified (for chained switches)
      if (targetTheme && targetTheme !== themeId) {
        await this.switchTheme(targetTheme, options);
      }

      // Clean up transitions
      if (enableTransitions) {
        this.cleanupTransitions();
      }

      // Call completion callback
      onComplete?.();

    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error during theme switch');
      onError?.(err);
      throw err;
    }
  }

  /**
   * Apply theme CSS custom properties to DOM
   */
  private async applyThemeToDOM(themeId: string, brandOverrides?: Record<string, any>): Promise<void> {
    const context: ThemeResolutionContext = {
      themeId,
      ...(brandOverrides && { brandOverrides })
    };

    const tokens = themeRegistry.resolveTokens(context);
    const cssVariables = this.generateCSSVariables(tokens);

    // Apply CSS variables to root element
    Object.entries(cssVariables).forEach(([property, value]) => {
      this.rootElement.style.setProperty(property, value);
    });

    // Set data attribute for CSS targeting
    this.rootElement.setAttribute('data-theme', themeId);

    // Dispatch custom event for framework integration
    this.rootElement.dispatchEvent(new CustomEvent('themechange', {
      detail: { themeId, tokens }
    }));
  }

  /**
   * Generate CSS custom properties from tokens
   */
  private generateCSSVariables(tokens: any): Record<string, string> {
    const variables: Record<string, string> = {};

    const processTokens = (obj: any, prefix: string = ''): void => {
      Object.entries(obj).forEach(([key, value]) => {
        const cssVarName = `--${prefix}${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        
        if (typeof value === 'object' && value !== null) {
          processTokens(value, `${prefix}${key}-`);
        } else {
          variables[cssVarName] = String(value);
        }
      });
    };

    processTokens(tokens);
    return variables;
  }

  /**
   * Set up smooth transitions for theme switching
   */
  private setupTransitions(duration: number): void {
    // Store original transition values
    const computedStyle = getComputedStyle(this.rootElement);
    const originalTransition = computedStyle.getPropertyValue('transition');
    
    // Set temporary data attribute to store original transition
    this.rootElement.setAttribute('data-original-transition', originalTransition);
    
    // Apply theme switch transition
    this.rootElement.style.setProperty('transition', `all ${duration}ms ease-in-out`);
  }

  /**
   * Clean up transitions after theme switch
   */
  private cleanupTransitions(): void {
    // Restore original transition after a brief delay
    this.transitionTimeout = window.setTimeout(() => {
      const originalTransition = this.rootElement.getAttribute('data-original-transition');
      if (originalTransition) {
        this.rootElement.style.setProperty('transition', originalTransition);
        this.rootElement.removeAttribute('data-original-transition');
      }
      this.transitionTimeout = null;
    }, 100);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): string {
    return this.currentTheme;
  }

  /**
   * Check if a theme is available
   */
  isThemeAvailable(themeId: string): boolean {
    return themeRegistry.getTheme(themeId) !== undefined;
  }

  /**
   * Get list of available themes
   */
  getAvailableThemes(): Array<{ name: string; displayName: string; description?: string }> {
    return themeRegistry.listThemes();
  }
}

// =============================================================================
// AUTOMATIC THEME DETECTION
// =============================================================================

export interface AutoThemeOptions {
  /** Enable automatic light/dark theme based on user preference */
  enableAutoMode?: boolean;
  /** Theme to use for light mode */
  lightTheme?: string;
  /** Theme to use for dark mode */
  darkTheme?: string;
  /** Watch for system preference changes */
  watchSystemChanges?: boolean;
  /** Callback when auto theme changes */
  onAutoThemeChange?: (themeId: string, isDark: boolean) => void;
}

/**
 * Auto Theme Manager - Handles automatic theme detection based on system preferences
 */
export class AutoThemeManager {
  private mediaQuery: MediaQueryList;
  private switcher: ThemeSwitcher;
  private options: Required<AutoThemeOptions>;
  private isWatching: boolean = false;

  constructor(switcher: ThemeSwitcher, options: AutoThemeOptions = {}) {
    this.switcher = switcher;
    this.options = {
      enableAutoMode: options.enableAutoMode ?? false,
      lightTheme: options.lightTheme ?? 'default',
      darkTheme: options.darkTheme ?? 'dark',
      watchSystemChanges: options.watchSystemChanges ?? true,
      onAutoThemeChange: options.onAutoThemeChange ?? (() => {})
    };

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  /**
   * Initialize auto theme detection
   */
  initialize(): void {
    if (!this.options.enableAutoMode) return;

    // Apply initial theme based on system preference
    this.applySystemTheme();

    // Start watching for system changes if enabled
    if (this.options.watchSystemChanges) {
      this.startWatching();
    }
  }

  /**
   * Apply theme based on current system preference
   */
  private applySystemTheme(): void {
    const isDark = this.mediaQuery.matches;
    const targetTheme = isDark ? this.options.darkTheme : this.options.lightTheme;

    this.switcher.switchTheme(targetTheme, {
      enableTransitions: true,
      onComplete: () => {
        this.options.onAutoThemeChange(targetTheme, isDark);
      }
    });
  }

  /**
   * Start watching for system preference changes
   */
  private startWatching(): void {
    if (this.isWatching) return;

    this.mediaQuery.addEventListener('change', this.handleSystemChange);
    this.isWatching = true;
  }

  /**
   * Stop watching for system preference changes
   */
  private stopWatching(): void {
    if (!this.isWatching) return;

    this.mediaQuery.removeEventListener('change', this.handleSystemChange);
    this.isWatching = false;
  }

  /**
   * Handle system preference change
   */
  private handleSystemChange = (): void => {
    this.applySystemTheme();
  };

  /**
   * Update options
   */
  updateOptions(newOptions: Partial<AutoThemeOptions>): void {
    this.options = { ...this.options, ...newOptions };
    
    // Reapply theme if auto mode is enabled
    if (this.options.enableAutoMode) {
      this.applySystemTheme();
    }
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.stopWatching();
  }
}

// =============================================================================
// PERSISTENT THEME STORAGE
// =============================================================================

export interface ThemeStorageOptions {
  /** Storage key for theme preference */
  storageKey?: string;
  /** Enable persistent storage */
  enablePersistence?: boolean;
  /** Storage type */
  storageType?: 'localStorage' | 'sessionStorage';
}

/**
 * Theme Storage Manager - Handles persistent theme preferences
 */
export class ThemeStorageManager {
  private options: Required<ThemeStorageOptions>;

  constructor(options: ThemeStorageOptions = {}) {
    this.options = {
      storageKey: options.storageKey ?? 'design-system-theme',
      enablePersistence: options.enablePersistence ?? true,
      storageType: options.storageType ?? 'localStorage'
    };
  }

  /**
   * Save theme preference
   */
  saveTheme(themeId: string): void {
    if (!this.options.enablePersistence) return;

    try {
      const storage = this.getStorage();
      storage.setItem(this.options.storageKey, themeId);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  /**
   * Load theme preference
   */
  loadTheme(): string | null {
    if (!this.options.enablePersistence) return null;

    try {
      const storage = this.getStorage();
      return storage.getItem(this.options.storageKey);
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
      return null;
    }
  }

  /**
   * Clear theme preference
   */
  clearTheme(): void {
    if (!this.options.enablePersistence) return;

    try {
      const storage = this.getStorage();
      storage.removeItem(this.options.storageKey);
    } catch (error) {
      console.warn('Failed to clear theme preference:', error);
    }
  }

  /**
   * Get storage instance
   */
  private getStorage(): Storage {
    return this.options.storageType === 'sessionStorage' 
      ? window.sessionStorage 
      : window.localStorage;
  }
}

// =============================================================================
// INTEGRATED THEME MANAGER
// =============================================================================

export interface IntegratedThemeOptions extends 
  ThemeSwitchOptions, 
  AutoThemeOptions, 
  ThemeStorageOptions {
  /** Initial theme to apply */
  initialTheme?: string;
}

/**
 * Integrated Theme Manager - Combines all theme management features
 */
export class IntegratedThemeManager {
  private switcher: ThemeSwitcher;
  private autoManager: AutoThemeManager;
  private storageManager: ThemeStorageManager;
  private options: IntegratedThemeOptions;

  constructor(options: IntegratedThemeOptions = {}) {
    this.switcher = new ThemeSwitcher();
    this.autoManager = new AutoThemeManager(this.switcher, options);
    this.storageManager = new ThemeStorageManager(options);
    this.options = options;
  }

  /**
   * Initialize the theme system
   */
  async initialize(): Promise<void> {
    try {
      // Determine initial theme
      let initialTheme = this.options.initialTheme;

      // Try to load from storage first
      if (!initialTheme && this.options.enablePersistence) {
        const savedTheme = this.storageManager.loadTheme();
        if (savedTheme) {
          initialTheme = savedTheme;
        }
      }

      // Fall back to system preference if auto mode is enabled
      if (!initialTheme && this.options.enableAutoMode) {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = isDark ? this.options.darkTheme : this.options.lightTheme;
      }

      // Default to 'default' theme
      if (!initialTheme || !this.switcher.isThemeAvailable(initialTheme)) {
        initialTheme = 'default';
      }

      // Apply initial theme
      await this.switcher.switchTheme(initialTheme, {
        enableTransitions: false, // No transition on initial load
        ...this.options
      });

      // Save to storage
      this.storageManager.saveTheme(initialTheme);

      // Initialize auto theme detection
      this.autoManager.initialize();

    } catch (error) {
      console.error('Failed to initialize theme system:', error);
      // Fallback to default theme
      await this.switcher.switchTheme('default', { enableTransitions: false });
    }
  }

  /**
   * Switch to a specific theme
   */
  async switchTheme(themeId: string, options: Partial<ThemeSwitchOptions> = {}): Promise<void> {
    await this.switcher.switchTheme(themeId, { ...this.options, ...options });
    
    // Save to storage
    this.storageManager.saveTheme(themeId);
  }

  /**
   * Enable/disable auto mode
   */
  setAutoMode(enabled: boolean): void {
    this.autoManager.updateOptions({ enableAutoMode: enabled });
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): string {
    return this.switcher.getCurrentTheme();
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): Array<{ name: string; displayName: string; description?: string }> {
    return this.switcher.getAvailableThemes();
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.autoManager.cleanup();
  }
}

// =============================================================================
// GLOBAL INSTANCES
// =============================================================================

/** Global theme switcher instance */
export const themeSwitcher = new ThemeSwitcher();

/** Global integrated theme manager instance */
export const themeManager = new IntegratedThemeManager();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Quick theme switch function for simple use cases
 */
export async function switchTheme(themeId: string, options?: ThemeSwitchOptions): Promise<void> {
  await themeSwitcher.switchTheme(themeId, options);
}

/**
 * Get current theme
 */
export function getCurrentTheme(): string {
  return themeSwitcher.getCurrentTheme();
}

/**
 * Check if theme is available
 */
export function isThemeAvailable(themeId: string): boolean {
  return themeSwitcher.isThemeAvailable(themeId);
}

/**
 * Get available themes
 */
export function getAvailableThemes(): Array<{ name: string; displayName: string; description?: string }> {
  return themeSwitcher.getAvailableThemes();
}
