/**
 * Theme name definitions
 * Provides type-safe theme names for the design system
 */

export type ThemeName = 'light' | 'dark';
export type BrandName = 'firm' | 'platform';
export type ThemeVariant = `${ThemeName}-${BrandName}`;

export interface ThemeDefinition {
  name: ThemeName;
  displayName: string;
  description: string;
  isDefault?: boolean;
}

export interface BrandDefinition {
  name: BrandName;
  displayName: string;
  description: string;
  isDefault?: boolean;
}

export const themes: Record<ThemeName, ThemeDefinition> = {
  light: {
    name: 'light',
    displayName: 'Light Theme',
    description: 'Default light theme for the design system',
    isDefault: true
  },
  dark: {
    name: 'dark',
    displayName: 'Dark Theme',
    description: 'Dark theme variant for low-light environments'
  }
};

export const brands: Record<BrandName, BrandDefinition> = {
  firm: {
    name: 'firm',
    displayName: 'Firm Brand',
    description: 'Firm-specific brand identity',
    isDefault: true
  },
  platform: {
    name: 'platform',
    displayName: 'Platform Brand',
    description: 'Platform-wide brand identity'
  }
};

/**
 * Get all available themes
 */
export function getAllThemes(): ThemeDefinition[] {
  return Object.values(themes);
}

/**
 * Get all available brands
 */
export function getAllBrands(): BrandDefinition[] {
  return Object.values(brands);
}

/**
 * Get default theme
 */
export function getDefaultTheme(): ThemeDefinition {
  return Object.values(themes).find(theme => theme.isDefault) || themes.light;
}

/**
 * Get default brand
 */
export function getDefaultBrand(): BrandDefinition {
  return Object.values(brands).find(brand => brand.isDefault) || brands.firm;
}

/**
 * Get theme definition by name
 */
export function getTheme(name: ThemeName): ThemeDefinition | undefined {
  return themes[name];
}

/**
 * Get brand definition by name
 */
export function getBrand(name: BrandName): BrandDefinition | undefined {
  return brands[name];
}

/**
 * Check if a theme name is valid
 */
export function isValidTheme(name: string): name is ThemeName {
  return name in themes;
}

/**
 * Check if a brand name is valid
 */
export function isValidBrand(name: string): name is BrandName {
  return name in brands;
}

/**
 * Get all theme variants (theme + brand combinations)
 */
export function getThemeVariants(): ThemeVariant[] {
  const variants: ThemeVariant[] = [];
  
  for (const themeName of Object.keys(themes) as ThemeName[]) {
    for (const brandName of Object.keys(brands) as BrandName[]) {
      variants.push(`${themeName}-${brandName}` as ThemeVariant);
    }
  }
  
  return variants;
}

/**
 * Parse theme variant string
 */
export function parseThemeVariant(variant: string): { theme: ThemeName | null; brand: BrandName | null } {
  const [theme, brand] = variant.split('-') as [ThemeName | undefined, BrandName | undefined];
  
  return {
    theme: theme && isValidTheme(theme) ? theme : null,
    brand: brand && isValidBrand(brand) ? brand : null
  };
}

/**
 * Create theme variant string
 */
export function createThemeVariant(theme: ThemeName, brand: BrandName): ThemeVariant {
  return `${theme}-${brand}`;
}
