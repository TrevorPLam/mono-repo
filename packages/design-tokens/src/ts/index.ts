/**
 * TypeScript token utilities
 * Provides type-safe access to design tokens
 */

// Export token paths and types
export * from './token-paths';
export * from './token-types';
export * from './token-groups';
export * from './theme-names';

// Utility functions
export function getTokenValue(path: string): any {
  // Simple token resolution for now
  const parts = path.split('.');
  // This would resolve from the actual token system
  return null; // Placeholder implementation
}

export function isCoreTokenPath(path: string): boolean {
  return path.startsWith('core.');
}

export function isSemanticTokenPath(path: string): boolean {
  return path.startsWith('semantic.');
}
