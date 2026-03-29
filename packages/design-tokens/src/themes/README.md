# Theme System Documentation

## Overview

The design tokens package includes a comprehensive theme system that enables multi-theme support, runtime theme switching, and brand customization for marketing firm clients. This system follows modern best practices and the W3C Design Tokens Format Module 2025.10 standards.

## Architecture

### Three-Layer Token Architecture

1. **Primitive Tokens**: Raw values (colors, sizes, fonts)
2. **Semantic Tokens**: Purpose-driven mappings (primary, secondary, text-primary)
3. **Theme Tokens**: Complete theme definitions with overrides

### Core Components

- **Theme Registry**: Central management for all themes
- **Token Resolver**: Runtime token resolution with context
- **Theme Switcher**: CSS-based theme switching utilities
- **Brand System**: Client customization workflow
- **Validation System**: Zod-based validation for all components

## Quick Start

### Basic Usage

```typescript
import { initializeThemes, themeRegistry, switchTheme } from '@repo/design-tokens';

// Initialize the theme system
initializeThemes();

// Switch to a different theme
await switchTheme('dark', {
  enableTransitions: true,
  transitionDuration: 300
});

// Get current theme
const currentTheme = themeRegistry.getActiveTheme();
```

### Brand Customization

```typescript
import { createBrandBuilder, brandManager } from '@repo/design-tokens';

// Create a custom brand theme
const brandTheme = createBrandBuilder()
  .setIdentity('client-a', 'Client A', 'Client A Organization')
  .setPrimaryColor('#ff6b6b')
  .setSecondaryColor('#4ecdc4')
  .setFontFamily('"Inter Custom", sans-serif')
  .setBorderRadius('0.75rem')
  .build();

// Register and activate the brand theme
brandManager.createProfile({
  name: 'Client A',
  customization: brandTheme
});

brandManager.activateTheme('client-a');
```

### CSS Generation

```typescript
import { generateThemeAwareCSS } from '@repo/design-tokens';

// Generate theme-aware CSS
const cssOutput = generateThemeAwareCSS(designTokens, {
  includeThemeSwitching: true,
  includeBrandCustomizations: true,
  themes: ['default', 'dark', 'high-contrast']
});

console.log(cssOutput.combinedCSS);
```

## Theme Registry

### Registration

The theme registry manages all available themes and provides a centralized API for theme operations.

```typescript
import { themeRegistry, type ThemeTokens } from '@repo/design-tokens';

const customTheme: ThemeTokens = {
  name: 'custom',
  displayName: 'Custom Theme',
  description: 'A custom theme for specific use cases',
  tokens: {
    primitive: { /* primitive tokens */ },
    semantic: { /* semantic tokens */ }
  }
};

// Register the theme
themeRegistry.registerTheme(customTheme);

// Set as active theme
themeRegistry.setActiveTheme('custom');

// Get theme details
const theme = themeRegistry.getTheme('custom');
const allThemes = themeRegistry.listThemes();
```

### Token Resolution

Resolve tokens with context-aware overrides for dynamic customization.

```typescript
import { tokenResolver, type ThemeResolutionContext } from '@repo/design-tokens';

const context: ThemeResolutionContext = {
  themeId: 'dark',
  brandOverrides: {
    'semantic.colors.color-primary': '#custom-blue',
    'semantic.spacing.component-padding': '1.5rem'
  },
  mode: 'dark',
  density: 'comfortable'
};

// Resolve specific token
const primaryColor = tokenResolver.resolveToken('semantic.colors.color-primary');

// Get all resolved tokens
const allTokens = tokenResolver.getAllTokens();
```

## Theme Switching

### Runtime Switching

The theme switcher provides smooth transitions and CSS custom property updates.

```typescript
import { 
  themeSwitcher, 
  switchTheme, 
  themeManager,
  type ThemeSwitchOptions 
} from '@repo/design-tokens';

const options: ThemeSwitchOptions = {
  enableTransitions: true,
  transitionDuration: 300,
  onComplete: () => console.log('Theme switched!'),
  onError: (error) => console.error('Switch failed:', error)
};

// Switch theme with transitions
await switchTheme('dark', options);

// Or use the integrated manager
await themeManager.initialize();
await themeManager.switchTheme('high-contrast');
```

### Automatic Theme Detection

Enable automatic light/dark theme switching based on user preferences.

```typescript
import { AutoThemeManager } from '@repo/design-tokens';

const autoManager = new AutoThemeManager(themeSwitcher, {
  enableAutoMode: true,
  lightTheme: 'default',
  darkTheme: 'dark',
  watchSystemChanges: true,
  onAutoThemeChange: (themeId, isDark) => {
    console.log(`Switched to ${themeId} (${isDark ? 'dark' : 'light'})`);
  }
});

autoManager.initialize();
```

### Persistent Storage

Store theme preferences in localStorage or sessionStorage.

```typescript
import { ThemeStorageManager } from '@repo/design-tokens';

const storage = new ThemeStorageManager({
  storageKey: 'app-theme',
  enablePersistence: true,
  storageType: 'localStorage'
});

// Save theme preference
storage.saveTheme('dark');

// Load theme preference
const savedTheme = storage.loadTheme();
```

## Brand Customization

### Brand Profiles

Manage client-specific brand configurations with a complete workflow.

```typescript
import { 
  brandManager, 
  type ClientBrandProfile,
  type BrandCustomization 
} from '@repo/design-tokens';

const profile: ClientBrandProfile = {
  id: 'client-xyz',
  name: 'Client XYZ',
  organization: 'XYZ Corporation',
  customization: {
    id: 'client-xyz',
    name: 'Client XYZ',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    fontFamily: '"Inter", sans-serif',
    borderRadius: '0.5rem'
  },
  metadata: {
    created: '2026-03-29T00:00:00Z',
    updated: '2026-03-29T00:00:00Z',
    version: '1.0.0'
  },
  status: 'draft'
};

// Create and manage profile
brandManager.createProfile(profile);
brandManager.updateProfile('client-xyz', { status: 'review' });
brandManager.activateTheme('client-xyz');
```

### Brand Presets

Use predefined templates for common client types.

```typescript
import { 
  getBrandPresets, 
  createProfileFromPreset 
} from '@repo/design-tokens';

// Get all presets
const allPresets = getBrandPresets();

// Get presets by category
const corporatePresets = getBrandPresets('corporate');

// Create profile from preset
const techProfile = createProfileFromPreset(
  'tech-green',
  'Tech Startup Inc',
  'Tech Startup Inc.'
);
```

### Brand Builder Pattern

Use the fluent builder API for brand customization.

```typescript
import { createBrandBuilder } from '@repo/design-tokens';

const brandCustomization = createBrandBuilder()
  .setIdentity('modern-brand', 'Modern Brand', 'Modern Brand Co.')
  .setPrimaryColor('#6366f1')
  .setSecondaryColor('#8b5cf6')
  .setAccentColor('#f59e0b')
  .setFontFamily('"Space Grotesk", sans-serif')
  .setBorderRadius('1rem')
  .addCustomToken('semantic.colors.brand-gradient', 'linear-gradient(135deg, #6366f1, #8b5cf6)')
  .addCustomTokens({
    'semantic.motion.brand-duration': '250ms',
    'semantic.motion.brand-easing': 'cubic-bezier(0.4, 0, 0.2, 1)'
  })
  .build();
```

## CSS Generation

### Theme-Aware CSS

Generate CSS with full theme system integration.

```typescript
import { 
  generateThemeAwareCSS,
  type ThemeAwareCSSGeneratorOptions 
} from '@repo/design-tokens';

const options: ThemeAwareCSSGeneratorOptions = {
  themes: ['default', 'dark', 'high-contrast'],
  includeThemeSwitching: true,
  includeBrandCustomizations: true,
  includeResponsiveThemes: false,
  themeClassPrefix: 'theme',
  generateRuntimeCSS: true,
  includeComments: true,
  includeTypedProperties: true
};

const cssOutput = generateThemeAwareCSS(designTokens, options);

// Access different CSS parts
console.log(cssOutput.baseCSS);        // Default theme CSS
console.log(cssOutput.themeCSS);        // Theme-specific CSS
console.log(cssOutput.brandCSS);        // Brand customization CSS
console.log(cssOutput.runtimeCSS);      // Runtime switching utilities
console.log(cssOutput.combinedCSS);     // Complete combined CSS
```

### Brand-Specific CSS

Generate CSS for specific brand customizations.

```typescript
import { generateBrandCSS } from '@repo/design-tokens';

const brandCSS = generateBrandCSS('client-a', brandTokens, {
  includeComments: true,
  themePrefix: 'brand'
});
```

### Responsive Theme CSS

Generate responsive variations of theme CSS.

```typescript
import { generateResponsiveThemeCSS } from '@repo/design-tokens';

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

const responsiveCSS = generateResponsiveThemeCSS(
  themes,
  breakpoints,
  { includeComments: true }
);
```

## Validation

### Theme Validation

Comprehensive validation for all theme system components.

```typescript
import {
  validateThemeRegistry,
  validateBrandCustomization,
  validateThemeBrandCompatibility,
  validateThemeAwareCSS
} from '@repo/design-tokens';

// Validate theme registry
const registryValidation = validateThemeRegistry(themeRegistry);

// Validate brand customization
const brandValidation = validateBrandCustomization(customization);

// Check theme-brand compatibility
const compatibility = validateThemeBrandCompatibility(theme, customization);

// Validate generated CSS
const cssValidation = validateThemeAwareCSS(cssOutput);
```

### Business Logic Validation

Validate business rules and workflow constraints.

```typescript
import {
  validateThemeTransitionPerformance,
  validateBrandProfileStatusTransition
} from '@repo/design-tokens';

// Performance validation
const performanceCheck = validateThemeTransitionPerformance(
  tokenCount: 1500,
  transitionDuration: 400
);

// Workflow validation
const statusCheck = validateBrandProfileStatusTransition(
  'draft',
  'review'
);
```

## Best Practices

### Theme Design

1. **Semantic Naming**: Use semantic token names (color-primary, text-body)
2. **Accessibility First**: Ensure WCAG 2.1 AA compliance in all themes
3. **Consistent Structure**: Follow the three-layer architecture
4. **Performance**: Keep token counts reasonable for fast switching

### Brand Customization

1. **Minimal Overrides**: Only customize what's necessary
2. **Brand Guidelines**: Follow client brand requirements
3. **Validation**: Always validate custom colors and values
4. **Workflow**: Use the proper review/approval workflow

### CSS Generation

1. **Bundle Size**: Generate only necessary CSS
2. **Runtime Support**: Include runtime switching utilities
3. **Validation**: Validate generated CSS for errors
4. **Performance**: Monitor CSS generation performance

## Examples

### Complete Theme Setup

```typescript
// 1. Initialize theme system
import { initializeThemes, themeManager } from '@repo/design-tokens';

initializeThemes();
await themeManager.initialize();

// 2. Create brand theme
import { createBrandBuilder, brandManager } from '@repo/design-tokens';

const clientBrand = createBrandBuilder()
  .setIdentity('acme-corp', 'Acme Corporation')
  .setPrimaryColor('#1e40af')
  .setSecondaryColor('#64748b')
  .setFontFamily('"Inter", sans-serif')
  .build();

brandManager.createProfile({
  name: 'Acme Corporation',
  customization: clientBrand
});

// 3. Generate CSS
import { generateThemeAwareCSS } from '@repo/design-tokens';

const css = generateThemeAwareCSS(designTokens, {
  includeBrandCustomizations: true,
  includeThemeSwitching: true
});

// 4. Use in application
document.head.appendChild(Object.assign(
  document.createElement('style'),
  { textContent: css.combinedCSS }
));
```

### Dynamic Theme Switching

```typescript
import { switchTheme, themeSwitcher } from '@repo/design-tokens';

// Theme switcher component
export function ThemeSelector() {
  const handleThemeChange = async (themeId: string) => {
    try {
      await switchTheme(themeId, {
        enableTransitions: true,
        transitionDuration: 300,
        onComplete: () => {
          // Update UI or notify users
          console.log(`Switched to ${themeId} theme`);
        }
      });
    } catch (error) {
      console.error('Theme switch failed:', error);
    }
  };

  return (
    <select onChange={(e) => handleThemeChange(e.target.value)}>
      <option value="default">Light</option>
      <option value="dark">Dark</option>
      <option value="high-contrast">High Contrast</option>
    </select>
  );
}
```

## API Reference

### Core Classes

- `ThemeRegistryManager`: Central theme management
- `TokenResolver`: Runtime token resolution
- `ThemeSwitcher`: CSS-based theme switching
- `BrandCustomizationManager`: Brand customization workflow
- `AutoThemeManager`: Automatic theme detection
- `ThemeStorageManager`: Persistent theme storage

### Utility Functions

- `initializeThemes()`: Initialize default themes
- `switchTheme()`: Switch themes with options
- `createBrandTheme()`: Create theme from customization
- `generateThemeAwareCSS()`: Generate theme CSS
- `validateTheme*()`: Validation functions

### Types

- `ThemeTokens`: Complete theme definition
- `BrandCustomization`: Brand customization config
- `ThemeResolutionContext`: Token resolution context
- `ThemeCSSOutput`: Generated CSS structure

## Migration Guide

### From Basic Tokens

1. **Install**: `@repo/design-tokens` package
2. **Initialize**: Call `initializeThemes()`
3. **Update CSS**: Use `generateThemeAwareCSS()`
4. **Add Switching**: Implement theme switcher
5. **Customize**: Add brand customizations as needed

### Performance Considerations

- **Token Count**: Keep under 1000 tokens per theme
- **CSS Size**: Monitor generated CSS bundle size
- **Switching Time**: Aim for < 300ms transitions
- **Memory Usage**: Monitor theme registry memory usage

## Troubleshooting

### Common Issues

1. **Theme Not Found**: Ensure theme is registered before switching
2. **CSS Not Applied**: Check CSS custom property names
3. **Validation Errors**: Verify token structure and types
4. **Performance Issues**: Reduce token count or disable transitions

### Debug Mode

Enable debug logging for troubleshooting:

```typescript
import { themeRegistry } from '@repo/design-tokens';

// Enable debug mode
themeRegistry.setDebugMode(true);

// Check theme registry state
console.log(themeRegistry.listThemes());
console.log(themeRegistry.getActiveTheme());
```

## Contributing

When contributing to the theme system:

1. **Tests**: Add comprehensive tests for new features
2. **Documentation**: Update this documentation
3. **Validation**: Add appropriate Zod schemas
4. **Performance**: Consider performance implications
5. **Accessibility**: Ensure WCAG compliance

## License

This theme system is part of the design tokens package and follows the same licensing terms.
