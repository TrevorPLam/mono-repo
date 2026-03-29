/**
 * Client Customization Framework
 * Enables runtime customization of design tokens for different clients/brands
 * Provides type-safe token overrides and theme composition
 */

// =============================================================================
// CLIENT CUSTOMIZATION TYPES
// =============================================================================

export interface ClientCustomization {
  clientId: string;
  clientName: string;
  brandColors?: Record<string, string>;
  customTokens?: Record<string, any>;
  themeOverrides?: ThemeOverrides;
  componentVariants?: ComponentVariants;
  customCSS?: string;
}

export interface ThemeOverrides {
  colors?: Record<string, string>;
  spacing?: Record<string, string>;
  typography?: Record<string, string>;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
  motion?: Record<string, string>;
}

export interface ComponentVariants {
  button?: ComponentVariantConfig;
  input?: ComponentVariantConfig;
  card?: ComponentVariantConfig;
  modal?: ComponentVariantConfig;
  [key: string]: ComponentVariantConfig | undefined;
}

export interface ComponentVariantConfig {
  variants: Record<string, Record<string, any>>;
  defaultVariant?: string;
}

export interface CustomizationContext {
  clientId: string;
  theme: string;
  brand: string;
  density?: 'compact' | 'comfortable' | 'spacious';
  platform?: 'web' | 'mobile' | 'desktop';
}

// =============================================================================
// CLIENT CUSTOMIZATION MANAGER
// =============================================================================

export class ClientCustomizationManager {
  private customizations = new Map<string, ClientCustomization>();
  private activeCustomization: string | null = null;
  private tokenOverrides = new Map<string, any>();

  /**
   * Register a client customization
   */
  registerCustomization(customization: ClientCustomization): void {
    this.validateCustomization(customization);
    this.customizations.set(customization.clientId, customization);
  }

  /**
   * Get a client customization
   */
  getCustomization(clientId: string): ClientCustomization | undefined {
    return this.customizations.get(clientId);
  }

  /**
   * Set active customization
   */
  setActiveCustomization(clientId: string): boolean {
    const customization = this.customizations.get(clientId);
    if (!customization) {
      console.warn(`Client customization not found: ${clientId}`);
      return false;
    }

    this.activeCustomization = clientId;
    this.applyCustomization(customization);
    return true;
  }

  /**
   * Get active customization
   */
  getActiveCustomization(): ClientCustomization | undefined {
    if (!this.activeCustomization) return undefined;
    return this.customizations.get(this.activeCustomization);
  }

  /**
   * Apply customization to tokens
   */
  private applyCustomization(customization: ClientCustomization): void {
    // Clear previous overrides
    this.tokenOverrides.clear();

    // Apply brand colors
    if (customization.brandColors) {
      for (const [key, value] of Object.entries(customization.brandColors)) {
        this.tokenOverrides.set(`brand.color.${key}`, value);
      }
    }

    // Apply custom tokens
    if (customization.customTokens) {
      this.applyCustomTokens(customization.customTokens);
    }

    // Apply theme overrides
    if (customization.themeOverrides) {
      this.applyThemeOverrides(customization.themeOverrides);
    }

    // Apply component variants
    if (customization.componentVariants) {
      this.applyComponentVariants(customization.componentVariants);
    }
  }

  /**
   * Apply custom tokens
   */
  private applyCustomTokens(tokens: Record<string, any>, prefix = 'custom'): void {
    for (const [key, value] of Object.entries(tokens)) {
      if (typeof value === 'object' && value !== null) {
        this.applyCustomTokens(value, `${prefix}.${key}`);
      } else {
        this.tokenOverrides.set(`${prefix}.${key}`, value);
      }
    }
  }

  /**
   * Apply theme overrides
   */
  private applyThemeOverrides(overrides: ThemeOverrides): void {
    for (const [category, tokens] of Object.entries(overrides)) {
      for (const [key, value] of Object.entries(tokens)) {
        this.tokenOverrides.set(`semantic.${category}.${key}`, value);
      }
    }
  }

  /**
   * Apply component variants
   */
  private applyComponentVariants(variants: ComponentVariants): void {
    for (const [component, config] of Object.entries(variants)) {
      for (const [variant, tokens] of Object.entries(config.variants)) {
        for (const [key, value] of Object.entries(tokens)) {
          this.tokenOverrides.set(`component.${component}.${variant}.${key}`, value);
        }
      }
    }
  }

  /**
   * Get token override
   */
  getTokenOverride(path: string): any {
    return this.tokenOverrides.get(path);
  }

  /**
   * Check if token has override
   */
  hasTokenOverride(path: string): boolean {
    return this.tokenOverrides.has(path);
  }

  /**
   * Get all token overrides
   */
  getAllTokenOverrides(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of this.tokenOverrides) {
      this.setNestedValue(result, key, value);
    }
    return result;
  }

  /**
   * Set nested value in object
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }

  /**
   * Validate customization
   */
  private validateCustomization(customization: ClientCustomization): void {
    if (!customization.clientId) {
      throw new Error('Client customization must have clientId');
    }
    
    if (!customization.clientName) {
      throw new Error('Client customization must have clientName');
    }

    // Validate brand colors
    if (customization.brandColors) {
      this.validateBrandColors(customization.brandColors);
    }

    // Validate theme overrides
    if (customization.themeOverrides) {
      this.validateThemeOverrides(customization.themeOverrides);
    }
  }

  /**
   * Validate brand colors
   */
  private validateBrandColors(colors: Record<string, string>): void {
    for (const [key, value] of Object.entries(colors)) {
      if (!this.isValidColor(value)) {
        throw new Error(`Invalid brand color ${key}: ${value}`);
      }
    }
  }

  /**
   * Validate theme overrides
   */
  private validateThemeOverrides(overrides: ThemeOverrides): void {
    for (const [category, tokens] of Object.entries(overrides)) {
      for (const [key, value] of Object.entries(tokens)) {
        if (category === 'colors' && !this.isValidColor(value)) {
          throw new Error(`Invalid color override ${category}.${key}: ${value}`);
        }
      }
    }
  }

  /**
   * Check if value is valid color
   */
  private isValidColor(value: string): boolean {
    const colorRegex = /^(#([0-9a-fA-F]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;
    return colorRegex.test(value);
  }

  /**
   * List all customizations
   */
  listCustomizations(): Array<{ clientId: string; clientName: string; isActive: boolean }> {
    return Array.from(this.customizations.values()).map(customization => ({
      clientId: customization.clientId,
      clientName: customization.clientName,
      isActive: customization.clientId === this.activeCustomization
    }));
  }

  /**
   * Remove customization
   */
  removeCustomization(clientId: string): boolean {
    const removed = this.customizations.delete(clientId);
    
    if (removed && this.activeCustomization === clientId) {
      this.activeCustomization = null;
      this.tokenOverrides.clear();
    }
    
    return removed;
  }

  /**
   * Clear all customizations
   */
  clearAllCustomizations(): void {
    this.customizations.clear();
    this.activeCustomization = null;
    this.tokenOverrides.clear();
  }
}

// =============================================================================
// THEME COMPOSER
// =============================================================================

export class ThemeComposer {
  private customizationManager: ClientCustomizationManager;

  constructor(customizationManager: ClientCustomizationManager) {
    this.customizationManager = customizationManager;
  }

  /**
   * Compose theme with client customizations
   */
  composeTheme(baseTheme: any, context: CustomizationContext): any {
    const composed = this.deepClone(baseTheme);
    
    // Apply client customizations
    if (this.customizationManager.getActiveCustomization()) {
      this.applyCustomizationsToTheme(composed);
    }

    // Apply context-specific adjustments
    this.applyContextAdjustments(composed, context);

    return composed;
  }

  /**
   * Apply customizations to theme
   */
  private applyCustomizationsToTheme(theme: any): void {
    const overrides = this.customizationManager.getAllTokenOverrides();
    this.mergeObjects(theme, overrides);
  }

  /**
   * Apply context adjustments
   */
  private applyContextAdjustments(theme: any, context: CustomizationContext): void {
    // Apply density adjustments
    if (context.density) {
      this.applyDensityAdjustments(theme, context.density);
    }

    // Apply platform adjustments
    if (context.platform) {
      this.applyPlatformAdjustments(theme, context.platform);
    }
  }

  /**
   * Apply density adjustments
   */
  private applyDensityAdjustments(theme: any, density: string): void {
    const densityMultipliers = {
      compact: 0.75,
      comfortable: 1,
      spacious: 1.25
    };

    const multiplier = densityMultipliers[density] || 1;
    
    // Apply to spacing tokens
    if (theme.spacing) {
      for (const [key, value] of Object.entries(theme.spacing)) {
        if (typeof value === 'string' && value.includes('px')) {
          const pixels = parseFloat(value.replace('px', ''));
          theme.spacing[key] = `${pixels * multiplier}px`;
        }
      }
    }
  }

  /**
   * Apply platform adjustments
   */
  private applyPlatformAdjustments(theme: any, platform: string): void {
    switch (platform) {
      case 'mobile':
        // Increase touch targets
        if (theme.component?.button) {
          theme.component.button.height.base = '48px';
          theme.component.button.padding.horizontal = '16px';
        }
        break;
        
      case 'desktop':
        // Optimize for mouse interaction
        if (theme.component?.button) {
          theme.component.button.height.base = '40px';
        }
        break;
    }
  }

  /**
   * Deep merge objects
   */
  private mergeObjects(target: any, source: any): void {
    for (const [key, value] of Object.entries(source)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        this.mergeObjects(target[key], value);
      } else {
        target[key] = value;
      }
    }
  }

  /**
   * Deep clone object
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

// =============================================================================
// CLIENT CUSTOMIZATION BUILDER
// =============================================================================

export class ClientCustomizationBuilder {
  private customization: Partial<ClientCustomization> = {};

  /**
   * Set client ID
   */
  clientId(id: string): this {
    this.customization.clientId = id;
    return this;
  }

  /**
   * Set client name
   */
  clientName(name: string): this {
    this.customization.clientName = name;
    return this;
  }

  /**
   * Add brand colors
   */
  brandColors(colors: Record<string, string>): this {
    this.customization.brandColors = {
      ...this.customization.brandColors,
      ...colors
    };
    return this;
  }

  /**
   * Add brand color
   */
  brandColor(name: string, value: string): this {
    if (!this.customization.brandColors) {
      this.customization.brandColors = {};
    }
    this.customization.brandColors[name] = value;
    return this;
  }

  /**
   * Add custom tokens
   */
  customTokens(tokens: Record<string, any>): this {
    this.customization.customTokens = {
      ...this.customization.customTokens,
      ...tokens
    };
    return this;
  }

  /**
   * Add custom token
   */
  customToken(path: string, value: any): this {
    if (!this.customization.customTokens) {
      this.customization.customTokens = {};
    }
    this.setNestedValue(this.customization.customTokens, path, value);
    return this;
  }

  /**
   * Add theme overrides
   */
  themeOverrides(overrides: ThemeOverrides): this {
    this.customization.themeOverrides = {
      ...this.customization.themeOverrides,
      ...overrides
    };
    return this;
  }

  /**
   * Add theme override
   */
  themeOverride(category: string, key: string, value: any): this {
    if (!this.customization.themeOverrides) {
      this.customization.themeOverrides = {};
    }
    if (!this.customization.themeOverrides[category]) {
      this.customization.themeOverrides[category] = {};
    }
    this.customization.themeOverrides[category][key] = value;
    return this;
  }

  /**
   * Add component variants
   */
  componentVariants(variants: ComponentVariants): this {
    this.customization.componentVariants = {
      ...this.customization.componentVariants,
      ...variants
    };
    return this;
  }

  /**
   * Add component variant
   */
  componentVariant(component: string, variant: string, tokens: Record<string, any>): this {
    if (!this.customization.componentVariants) {
      this.customization.componentVariants = {};
    }
    if (!this.customization.componentVariants[component]) {
      this.customization.componentVariants[component] = {
        variants: {}
      };
    }
    this.customization.componentVariants[component].variants[variant] = tokens;
    return this;
  }

  /**
   * Add custom CSS
   */
  customCSS(css: string): this {
    this.customization.customCSS = css;
    return this;
  }

  /**
   * Build customization
   */
  build(): ClientCustomization {
    if (!this.customization.clientId) {
      throw new Error('Client ID is required');
    }
    
    if (!this.customization.clientName) {
      throw new Error('Client name is required');
    }

    return this.customization as ClientCustomization;
  }

  /**
   * Set nested value
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }
}

// =============================================================================
// PRESET CUSTOMIZATIONS
// =============================================================================

export const presetCustomizations = {
  /**
   * Healthcare client preset
   */
  healthcare: new ClientCustomizationBuilder()
    .clientId('healthcare')
    .clientName('Healthcare Client')
    .brandColors({
      primary: '#0066CC',
      secondary: '#00A8E8',
      accent: '#00C9FF',
      success: '#00BFA5',
      warning: '#FFB700',
      error: '#DC3545'
    })
    .themeOverride('colors', 'primary', '#0066CC')
    .themeOverride('colors', 'secondary', '#00A8E8')
    .componentVariant('button', 'medical', {
      height: { base: '44px' },
      borderRadius: { base: '22px' },
      padding: { horizontal: '20px' }
    })
    .build(),

  /**
   * Finance client preset
   */
  finance: new ClientCustomizationBuilder()
    .clientId('finance')
    .clientName('Finance Client')
    .brandColors({
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    })
    .themeOverride('colors', 'primary', '#1E3A8A')
    .themeOverride('colors', 'secondary', '#3B82F6')
    .themeOverride('borderRadius', 'base', '4px')
    .themeOverride('shadows', 'base', '0 1px 3px 0 rgba(0, 0, 0, 0.1)')
    .build(),

  /**
   * Technology client preset
   */
  technology: new ClientCustomizationBuilder()
    .clientId('technology')
    .clientName('Technology Client')
    .brandColors({
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#A78BFA',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    })
    .themeOverride('colors', 'primary', '#6366F1')
    .themeOverride('colors', 'secondary', '#8B5CF6')
    .themeOverride('borderRadius', 'base', '8px')
    .customToken('motion.duration.fast', '150ms')
    .customToken('motion.easing.ease', 'cubic-bezier(0.4, 0, 0.2, 1)')
    .build()
};

// =============================================================================
// EXPORTS
// =============================================================================

export const clientCustomizationManager = new ClientCustomizationManager();
export const themeComposer = new ThemeComposer(clientCustomizationManager);

// Utility exports
export { ClientCustomizationBuilder as Builder };
