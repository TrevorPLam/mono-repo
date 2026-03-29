/**
 * Sizing tokens for the design system
 * Component sizing, icon sizing, and container sizing
 */

import type { SizingPrimitiveTokens } from '../schema/types';

export const primitiveSizing: SizingPrimitiveTokens = {
  // Component sizing - Following 4px base scale
  'size-0': '0',
  'size-1': '0.25rem',      // 4px
  'size-2': '0.5rem',       // 8px
  'size-3': '0.75rem',      // 12px
  'size-4': '1rem',         // 16px
  'size-5': '1.25rem',      // 20px
  'size-6': '1.5rem',       // 24px
  'size-7': '1.75rem',      // 28px
  'size-8': '2rem',         // 32px
  'size-9': '2.25rem',      // 36px
  'size-10': '2.5rem',      // 40px
  'size-11': '2.75rem',     // 44px
  'size-12': '3rem',        // 48px
  'size-14': '3.5rem',      // 56px
  'size-16': '4rem',        // 64px
  'size-20': '5rem',        // 80px
  'size-24': '6rem',        // 96px
  'size-28': '7rem',        // 112px
  'size-32': '8rem',        // 128px
  'size-36': '9rem',        // 144px
  'size-40': '10rem',       // 160px
  'size-44': '11rem',       // 176px
  'size-48': '12rem',       // 192px
  'size-52': '13rem',       // 208px
  'size-56': '14rem',       // 224px
  'size-60': '15rem',       // 240px
  'size-64': '16rem',       // 256px
  'size-72': '18rem',       // 288px
  'size-80': '20rem',       // 320px
  'size-96': '24rem',       // 384px

  // Icon sizing - Optimized for common icon sizes
  'size-icon-xs': '0.75rem',   // 12px
  'size-icon-sm': '1rem',       // 16px
  'size-icon-md': '1.25rem',    // 20px
  'size-icon-lg': '1.5rem',     // 24px
  'size-icon-xl': '2rem',       // 32px

  // Container sizing - Responsive container max-widths
  'size-container-sm': '36rem',   // 576px - Small containers
  'size-container-md': '48rem',   // 768px - Medium containers
  'size-container-lg': '64rem',   // 1024px - Large containers
  'size-container-xl': '80rem',   // 1280px - Extra large containers
  'size-container-full': '100%',   // Full width containers
};
