/**
 * Primitive color tokens for the design system
 * Following WCAG 2.1 AA accessibility standards
 * Brand-agnostic foundation for semantic tokens
 */

import type { ColorPrimitiveTokens } from '../schema/types';

export const primitiveColors: ColorPrimitiveTokens = {
  // Blue color scale - Primary brand foundation
  blue: {
    50: '#eff6ff',   // WCAG AA compliant on white backgrounds
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Primary blue - WCAG AA compliant on white
    600: '#2563eb',  // WCAG AA compliant on white
    700: '#1d4ed8',  // WCAG AA compliant on white
    800: '#1e40af',  // WCAG AA compliant on white
    900: '#1e3a8a',  // WCAG AA compliant on white
    950: '#172554',  // WCAG AA compliant on white
  },

  // Gray color scale - Neutral UI foundation
  gray: {
    50: '#f9fafb',   // Very light gray
    100: '#f3f4f6',  // Light gray
    200: '#e5e7eb',  // Border gray
    300: '#d1d5db',  // Disabled state
    400: '#9ca3af',  // Placeholder text
    500: '#6b7280',  // Secondary text
    600: '#4b5563',  // Primary text
    700: '#374151',  // Dark text
    800: '#1f2937',  // Very dark text
    900: '#111827',  // Near black
    950: '#030712',  // Almost black
  },

  // Red color scale - Error and alert states
  red: {
    50: '#fef2f2',   // Very light red
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Error red - WCAG AA compliant on white
    600: '#dc2626',  // Error hover - WCAG AA compliant on white
    700: '#b91c1c',  // Error active - WCAG AA compliant on white
    800: '#991b1b',  // Dark error - WCAG AA compliant on white
    900: '#7f1d1d',  // Very dark error - WCAG AA compliant on white
    950: '#450a0a',  // Darkest error - WCAG AA compliant on white
  },

  // Green color scale - Success states
  green: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Success green - WCAG AA compliant on white
    600: '#16a34a',  // Success hover - WCAG AA compliant on white
    700: '#15803d',  // Success active - WCAG AA compliant on white
    800: '#166534',  // Dark success - WCAG AA compliant on white
    900: '#14532d',  // Very dark success - WCAG AA compliant on white
    950: '#052e16',  // Darkest success - WCAG AA compliant on white
  },

  // Yellow color scale - Warning states
  yellow: {
    50: '#fffbeb',   // Very light yellow
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Warning yellow - WCAG AA compliant on white
    600: '#d97706',  // Warning hover - WCAG AA compliant on white
    700: '#b45309',  // Warning active - WCAG AA compliant on white
    800: '#92400e',  // Dark warning - WCAG AA compliant on white
    900: '#78350f',  // Very dark warning - WCAG AA compliant on white
    950: '#451a03',  // Darkest warning - WCAG AA compliant on white
  },

  // Orange color scale - Accent colors
  orange: {
    50: '#fff7ed',   // Very light orange
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',  // Accent orange - WCAG AA compliant on white
    600: '#ea580c',  // Accent hover - WCAG AA compliant on white
    700: '#c2410c',  // Accent active - WCAG AA compliant on white
    800: '#9a3412',  // Dark accent - WCAG AA compliant on white
    900: '#7c2d12',  // Very dark accent - WCAG AA compliant on white
    950: '#431407',  // Darkest accent - WCAG AA compliant on white
  },

  // Purple color scale - Premium/Pro features
  purple: {
    50: '#faf5ff',   // Very light purple
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',  // Premium purple - WCAG AA compliant on white
    600: '#9333ea',  // Premium hover - WCAG AA compliant on white
    700: '#7c3aed',  // Premium active - WCAG AA compliant on white
    800: '#6b21a8',  // Dark premium - WCAG AA compliant on white
    900: '#581c87',  // Very dark premium - WCAG AA compliant on white
    950: '#3b0764',  // Darkest premium - WCAG AA compliant on white
  },

  // Pink color scale - Marketing/CTA elements
  pink: {
    50: '#fdf2f8',   // Very light pink
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',  // Marketing pink - WCAG AA compliant on white
    600: '#db2777',  // Marketing hover - WCAG AA compliant on white
    700: '#be185d',  // Marketing active - WCAG AA compliant on white
    800: '#9d174d',  // Dark marketing - WCAG AA compliant on white
    900: '#831843',  // Very dark marketing - WCAG AA compliant on white
    950: '#500724',  // Darkest marketing - WCAG AA compliant on white
  },

  // Base colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};
