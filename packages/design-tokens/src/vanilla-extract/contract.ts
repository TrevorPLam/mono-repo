/**
 * Vanilla Extract global variable contracts
 */

import { createVar } from '@vanilla-extract/css';

// Core color variables
export const colors = createVar({
  blue: {
    50: 'var(--repo-core-color-blue-50)',
    100: 'var(--repo-core-color-blue-100)',
    200: 'var(--repo-core-color-blue-200)',
    300: 'var(--repo-core-color-blue-300)',
    400: 'var(--repo-core-color-blue-400)',
    500: 'var(--repo-core-color-blue-500)',
    600: 'var(--repo-core-color-blue-600)',
    700: 'var(--repo-core-color-blue-700)',
    800: 'var(--repo-core-color-blue-800)',
    900: 'var(--repo-core-color-blue-900)',
    950: 'var(--repo-core-color-blue-950)',
  },
  gray: {
    50: 'var(--repo-core-color-gray-50)',
    100: 'var(--repo-core-color-gray-100)',
    200: 'var(--repo-core-color-gray-200)',
    300: 'var(--repo-core-color-gray-300)',
    400: 'var(--repo-core-color-gray-400)',
    500: 'var(--repo-core-color-gray-500)',
    600: 'var(--repo-core-color-gray-600)',
    700: 'var(--repo-core-color-gray-700)',
    800: 'var(--repo-core-color-gray-800)',
    900: 'var(--repo-core-color-gray-900)',
    950: 'var(--repo-core-color-gray-950)',
  },
  white: 'var(--repo-core-color-white)',
  black: 'var(--repo-core-color-black)',
  transparent: 'var(--repo-core-color-transparent)',
});

// Core spacing variables
export const spacing = createVar({
  0: 'var(--repo-core-spacing-0)',
  px: 'var(--repo-core-spacing-px)',
  0_5: 'var(--repo-core-spacing-0_5)',
  1: 'var(--repo-core-spacing-1)',
  1_5: 'var(--repo-core-spacing-1_5)',
  2: 'var(--repo-core-spacing-2)',
  3: 'var(--repo-core-spacing-3)',
  4: 'var(--repo-core-spacing-4)',
  6: 'var(--repo-core-spacing-6)',
  8: 'var(--repo-core-spacing-8)',
  10: 'var(--repo-core-spacing-10)',
  12: 'var(--repo-core-spacing-12)',
  16: 'var(--repo-core-spacing-16)',
  20: 'var(--repo-core-spacing-20)',
  24: 'var(--repo-core-spacing-24)',
});

// Core typography variables
export const typography = createVar({
  fontFamily: {
    sans: 'var(--repo-core-typography-fontFamily-sans)',
    serif: 'var(--repo-core-typography-fontFamily-serif)',
    mono: 'var(--repo-core-typography-fontFamily-mono)',
  },
  fontSize: {
    xs: 'var(--repo-core-typography-fontSize-xs)',
    sm: 'var(--repo-core-typography-fontSize-sm)',
    base: 'var(--repo-core-typography-fontSize-base)',
    lg: 'var(--repo-core-typography-fontSize-lg)',
    xl: 'var(--repo-core-typography-fontSize-xl)',
    2xl: 'var(--repo-core-typography-fontSize-2xl)',
    3xl: 'var(--repo-core-typography-fontSize-3xl)',
    4xl: 'var(--repo-core-typography-fontSize-4xl)',
    5xl: 'var(--repo-core-typography-fontSize-5xl)',
    6xl: 'var(--repo-core-typography-fontSize-6xl)',
  },
  fontWeight: {
    thin: 'var(--repo-core-typography-fontWeight-thin)',
    extralight: 'var(--repo-core-typography-fontWeight-extralight)',
    light: 'var(--repo-core-typography-fontWeight-light)',
    normal: 'var(--repo-core-typography-fontWeight-normal)',
    medium: 'var(--repo-core-typography-fontWeight-medium)',
    semibold: 'var(--repo-core-typography-fontWeight-semibold)',
    bold: 'var(--repo-core-typography-fontWeight-bold)',
    extrabold: 'var(--repo-core-typography-fontWeight-extrabold)',
    black: 'var(--repo-core-typography-fontWeight-black)',
  },
});
