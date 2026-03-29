/**
 * Theme System Validation Schemas
 * Zod schemas for validating theme system components
 * Extends existing token validation with theme-specific rules
 */

import { z } from 'zod';
import type { 
  ThemeTokens, 
  DesignTokens
} from '../schema/types';
import { 
  ThemeTokensSchema, 
  DesignTokensSchema,
  ColorValueSchema,
  LengthValueSchema
} from '../schema/schemas';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ThemeRegistry {
  themes: Map<string, ThemeTokens>;
  activeTheme: string;
  fallbackTheme: string;
}

export interface ThemeResolutionContext {
  themeId: string;
  brandOverrides?: Record<string, any>;
  mode?: 'light' | 'dark' | 'auto';
  density?: 'compact' | 'comfortable' | 'spacious';
}

export interface BrandCustomization {
  id: string;
  name: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  customTokens?: Record<string, any>;
}

export interface ValidationClientBrandProfile {
  id: string;
  name: string;
  organization?: string;
  customization: BrandCustomization;
  metadata?: {
    created: string;
    updated: string;
    version: string;
    notes?: string;
  };
  status: 'draft' | 'review' | 'approved' | 'active' | 'archived';
}

export interface ValidationBrandPreset {
  id: string;
  name: string;
  description: string;
  customization: BrandCustomization;
  category: 'corporate' | 'creative' | 'tech' | 'retail' | 'healthcare' | 'education';
}

// =============================================================================
// THEME REGISTRY VALIDATION
// =============================================================================

/**
 * Validates theme registry structure
 */
export const ThemeRegistrySchema = z.object({
  themes: z.instanceof(Map),
  activeTheme: z.string().min(1, 'Active theme name is required'),
  fallbackTheme: z.string().min(1, 'Fallback theme name is required'),
});

/**
 * Validates theme resolution context
 */
export const ThemeResolutionContextSchema = z.object({
  themeId: z.string().min(1, 'Theme ID is required'),
  brandOverrides: z.record(z.string(), z.any()).optional(),
  mode: z.enum(['light', 'dark', 'auto']).optional(),
  density: z.enum(['compact', 'comfortable', 'spacious']).optional(),
});

// =============================================================================
// BRAND CUSTOMIZATION VALIDATION
// =============================================================================

/**
 * Validates brand customization structure
 */
export const BrandCustomizationSchema = z.object({
  id: z.string()
    .min(1, 'Brand ID is required')
    .regex(/^[a-z0-9-]+$/, 'Brand ID must contain only lowercase letters, numbers, and hyphens'),
  name: z.string()
    .min(1, 'Brand name is required')
    .max(100, 'Brand name must be 100 characters or less'),
  primaryColor: ColorValueSchema.optional(),
  secondaryColor: ColorValueSchema.optional(),
  accentColor: ColorValueSchema.optional(),
  fontFamily: z.string()
    .min(1, 'Font family cannot be empty')
    .max(200, 'Font family must be 200 characters or less')
    .optional(),
  borderRadius: LengthValueSchema.optional(),
  customTokens: z.record(z.string(), z.any()).optional(),
});

/**
 * Validates client brand profile
 */
export const ValidationClientBrandProfileSchema = z.object({
  id: z.string().min(1, 'Profile ID is required'),
  name: z.string()
    .min(1, 'Profile name is required')
    .max(100, 'Profile name must be 100 characters or less'),
  organization: z.string().max(200, 'Organization name must be 200 characters or less').optional(),
  customization: BrandCustomizationSchema,
  metadata: z.object({
    created: z.string().datetime('Invalid created date format'),
    updated: z.string().datetime('Invalid updated date format'),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be in format x.y.z'),
    notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
  }),
  status: z.enum(['draft', 'review', 'approved', 'active', 'archived']),
});

/**
 * Validates brand preset
 */
export const ValidationBrandPresetSchema = z.object({
  id: z.string().min(1, 'Preset ID is required'),
  name: z.string().min(1, 'Preset name is required'),
  description: z.string().min(1, 'Preset description is required'),
  customization: BrandCustomizationSchema,
  category: z.enum(['corporate', 'creative', 'tech', 'retail', 'healthcare', 'education']),
});

// =============================================================================
// THEME SWITCHING VALIDATION
// =============================================================================

/**
 * Validates theme switch options
 */
export const ThemeSwitchOptionsSchema = z.object({
  enableTransitions: z.boolean().optional(),
  transitionDuration: z.number()
    .int('Transition duration must be an integer')
    .min(0, 'Transition duration cannot be negative')
    .max(5000, 'Transition duration cannot exceed 5000ms')
    .optional(),
  targetTheme: z.string().min(1, 'Target theme name is required').optional(),
  brandOverrides: z.record(z.string(), z.any()).optional(),
  onComplete: z.function().optional(),
  onError: z.function().optional(),
});

/**
 * Validates auto theme options
 */
export const AutoThemeOptionsSchema = z.object({
  enableAutoMode: z.boolean().optional(),
  lightTheme: z.string().min(1, 'Light theme name is required').optional(),
  darkTheme: z.string().min(1, 'Dark theme name is required').optional(),
  watchSystemChanges: z.boolean().optional(),
  onAutoThemeChange: z.function().optional(),
});

/**
 * Validates theme storage options
 */
export const ThemeStorageOptionsSchema = z.object({
  storageKey: z.string()
    .min(1, 'Storage key is required')
    .max(100, 'Storage key must be 100 characters or less')
    .optional(),
  enablePersistence: z.boolean().optional(),
  storageType: z.enum(['localStorage', 'sessionStorage']).optional(),
});

// =============================================================================
// ADVANCED VALIDATION SCHEMAS
// =============================================================================

/**
 * Validates theme inheritance structure
 */
export const ThemeInheritanceSchema = z.object({
  baseTheme: z.string().min(1, 'Base theme name is required'),
  overrides: z.record(z.string(), z.any()).optional(),
  extensions: z.array(z.string()).optional(),
});

/**
 * Validates theme accessibility compliance
 */
export const ThemeAccessibilitySchema = z.object({
  colorContrast: z.record(
    z.string(), // Token path
    z.object({
      foreground: ColorValueSchema,
      background: ColorValueSchema,
      ratio: z.number().min(1, 'Contrast ratio must be at least 1'),
      wcagLevel: z.enum(['AA', 'AAA']),
      passes: z.boolean(),
    })
  ).optional(),
  reducedMotion: z.boolean().optional(),
  keyboardNavigation: z.boolean().optional(),
  screenReaderSupport: z.boolean().optional(),
});

/**
 * Validates theme performance metrics
 */
export const ThemePerformanceSchema = z.object({
  tokenCount: z.number().int().min(0, 'Token count must be non-negative'),
  cssSize: z.number().min(0, 'CSS size must be non-negative'),
  buildTime: z.number().min(0, 'Build time must be non-negative'),
  memoryUsage: z.number().min(0, 'Memory usage must be non-negative').optional(),
});

// =============================================================================
// COMPOSITE VALIDATION SCHEMAS
// =============================================================================

/**
 * Validates complete theme system configuration
 */
export const ThemeSystemConfigSchema = z.object({
  registry: ThemeRegistrySchema,
  activeTheme: ThemeTokensSchema,
  brandProfiles: z.array(ValidationClientBrandProfileSchema),
  presets: z.array(ValidationBrandPresetSchema),
  switchOptions: ThemeSwitchOptionsSchema.optional(),
  autoOptions: AutoThemeOptionsSchema.optional(),
  storageOptions: ThemeStorageOptionsSchema.optional(),
  accessibility: ThemeAccessibilitySchema.optional(),
  performance: ThemePerformanceSchema.optional(),
});

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates theme registry
 */
export function validateThemeRegistry(registry: unknown): ThemeRegistry {
  return ThemeRegistrySchema.parse(registry) as ThemeRegistry;
}

/**
 * Validates theme resolution context
 */
export function validateThemeResolutionContext(context: unknown): ThemeResolutionContext {
  return ThemeResolutionContextSchema.parse(context) as ThemeResolutionContext;
}

/**
 * Validates brand customization
 */
export function validateBrandCustomization(customization: unknown): BrandCustomization {
  return BrandCustomizationSchema.parse(customization) as BrandCustomization;
}

/**
 * Validates client brand profile
 */
export function validateClientBrandProfile(profile: unknown): ValidationClientBrandProfile {
  return ValidationClientBrandProfileSchema.parse(profile) as ValidationClientBrandProfile;
}

/**
 * Validates brand preset
 */
export function validateBrandPreset(preset: unknown): ValidationBrandPreset {
  return ValidationBrandPresetSchema.parse(preset) as ValidationBrandPreset;
}

/**
 * Validates theme switch options
 */
export function validateThemeSwitchOptions(options: unknown) {
  return ThemeSwitchOptionsSchema.parse(options);
}

/**
 * Validates auto theme options
 */
export function validateAutoThemeOptions(options: unknown) {
  return AutoThemeOptionsSchema.parse(options);
}

/**
 * Validates theme storage options
 */
export function validateThemeStorageOptions(options: unknown) {
  return ThemeStorageOptionsSchema.parse(options);
}

/**
 * Validates complete theme system configuration
 */
export function validateThemeSystemConfig(config: unknown) {
  return ThemeSystemConfigSchema.parse(config);
}

// =============================================================================
// BUSINESS LOGIC VALIDATION
// =============================================================================

/**
 * Validates theme compatibility with brand customization
 */
export function validateThemeBrandCompatibility(
  theme: unknown, 
  customization: unknown
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  try {
    const validatedTheme = ThemeTokensSchema.parse(theme);
    const validatedCustomization = BrandCustomizationSchema.parse(customization);
    
    // Check if brand colors are valid CSS colors
    if (validatedCustomization.primaryColor) {
      try {
        ColorValueSchema.parse(validatedCustomization.primaryColor);
      } catch {
        errors.push('Primary color is not a valid CSS color');
      }
    }
    
    if (validatedCustomization.secondaryColor) {
      try {
        ColorValueSchema.parse(validatedCustomization.secondaryColor);
      } catch {
        errors.push('Secondary color is not a valid CSS color');
      }
    }
    
    if (validatedCustomization.accentColor) {
      try {
        ColorValueSchema.parse(validatedCustomization.accentColor);
      } catch {
        errors.push('Accent color is not a valid CSS color');
      }
    }
    
    // Check if border radius is valid
    if (validatedCustomization.borderRadius) {
      try {
        LengthValueSchema.parse(validatedCustomization.borderRadius);
      } catch {
        errors.push('Border radius is not a valid CSS length');
      }
    }
    
  } catch (error) {
    errors.push('Invalid theme or customization structure');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates theme transition performance
 */
export function validateThemeTransitionPerformance(
  tokenCount: number,
  transitionDuration: number
): { valid: boolean; recommendation: string } {
  const maxRecommendedTokens = 1000;
  const maxRecommendedDuration = 500;
  
  if (tokenCount > maxRecommendedTokens && transitionDuration > maxRecommendedDuration) {
    return {
      valid: false,
      recommendation: 'Consider reducing token count or transition duration for better performance'
    };
  }
  
  if (tokenCount > maxRecommendedTokens) {
    return {
      valid: true,
      recommendation: 'Large token count detected - monitor performance during theme transitions'
    };
  }
  
  if (transitionDuration > maxRecommendedDuration) {
    return {
      valid: true,
      recommendation: 'Long transition duration detected - consider shorter duration for better UX'
    };
  }
  
  return {
    valid: true,
    recommendation: 'Theme transition performance is optimal'
  };
}

/**
 * Validates brand profile workflow status transitions
 */
export function validateBrandProfileStatusTransition(
  currentStatus: string,
  newStatus: string
): { valid: boolean; error?: string } {
  const validTransitions: Record<string, string[]> = {
    'draft': ['review', 'archived'],
    'review': ['approved', 'draft', 'archived'],
    'approved': ['active', 'archived'],
    'active': ['archived'],
    'archived': ['draft']
  };
  
  const allowedTransitions = validTransitions[currentStatus];
  
  if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
    return {
      valid: false,
      error: `Invalid status transition from "${currentStatus}" to "${newStatus}"`
    };
  }
  
  return { valid: true };
}

// =============================================================================
// EXPORT TYPES FOR INFERENCE
// =============================================================================

export type ThemeRegistryType = z.infer<typeof ThemeRegistrySchema>;
export type ThemeResolutionContextType = z.infer<typeof ThemeResolutionContextSchema>;
export type BrandCustomizationType = z.infer<typeof BrandCustomizationSchema>;
export type ValidationClientBrandProfileType = z.infer<typeof ValidationClientBrandProfileSchema>;
export type ValidationBrandPresetType = z.infer<typeof ValidationBrandPresetSchema>;
export type ThemeSwitchOptionsType = z.infer<typeof ThemeSwitchOptionsSchema>;
export type AutoThemeOptionsType = z.infer<typeof AutoThemeOptionsSchema>;
export type ThemeStorageOptionsType = z.infer<typeof ThemeStorageOptionsSchema>;
export type ThemeSystemConfigType = z.infer<typeof ThemeSystemConfigSchema>;
