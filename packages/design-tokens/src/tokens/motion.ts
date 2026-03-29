/**
 * Motion tokens for the design system
 * Duration and easing functions for animations and transitions
 */

import type { MotionPrimitiveTokens } from '../schema/types';

export const primitiveMotion: MotionPrimitiveTokens = {
  // Durations - Fast to slow transitions
  'duration-75': '75ms',      // Very fast (micro-interactions)
  'duration-100': '100ms',     // Fast (hover states)
  'duration-150': '150ms',     // Quick (button interactions)
  'duration-200': '200ms',     // Standard (form interactions)
  'duration-300': '300ms',     // Moderate (page transitions)
  'duration-500': '500ms',     // Slow (modal transitions)
  'duration-700': '700ms',     // Slower (complex animations)
  'duration-1000': '1000ms',  // Very slow (loading states)

  // Easing functions - Natural and predictable motion
  'ease-linear': 'linear',
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',           // Accelerating
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',          // Decelerating
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',      // Accelerating then decelerating
  'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bouncy effect
};
