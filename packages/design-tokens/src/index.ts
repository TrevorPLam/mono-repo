/**
 * @repo/design-tokens Package
 * Enterprise design tokens for marketing applications
 * 
 * Features:
 * - Three-layer token architecture (core → semantic → component)
 * - Multi-theme support with runtime resolution
 * - CSS custom properties with @property rules
 * - Vanilla Extract integration
 * - Tailwind CSS v4 bridge
 * - Advanced validation and performance optimization
 * - Client customization framework
 */

// Core modules
export * from './css';
export * from './ts';
export * from './themes';
export * from './vanilla-extract';

// Phase 3: Enterprise Features
export * from './tailwind';
export * from './client-customization';

// Re-exports for convenience
export { themeRegistry, tokenResolver } from './themes';
export { clientCustomizationManager, themeComposer, Builder } from './client-customization';
export { generateTailwindConfig, generateTailwindCSS, tailwindMapping } from './tailwind';
