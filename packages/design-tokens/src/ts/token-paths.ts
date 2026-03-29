/**
 * Token path definitions
 * Provides type-safe paths for accessing design tokens
 */

export type TokenPath = 
  | `core.${string}.${string}`
  | `semantic.${string}.${string}`
  | `component.${string}.${string}`;

export type CoreTokenPath = 
  | `core.color.${string}`
  | `core.spacing.${string}`
  | `core.typography.${string}`
  | `core.border.${string}`
  | `core.radius.${string}`
  | `core.shadow.${string}`
  | `core.motion.${string}`
  | `core.opacity.${string}`
  | `core.size.${string}`
  | `core.z-index.${string}`
  | `core.breakpoints.${string}`;

export type SemanticTokenPath = 
  | `semantic.color.${string}`
  | `semantic.surface.${string}`
  | `semantic.text.${string}`
  | `semantic.border.${string}`
  | `semantic.icon.${string}`
  | `semantic.focus.${string}`
  | `semantic.spacing.${string}`
  | `semantic.typography.${string}`
  | `semantic.elevation.${string}`
  | `semantic.motion.${string}`;

export type ComponentTokenPath = 
  | `component.button.${string}`
  | `component.input.${string}`
  | `component.card.${string}`;

/**
 * Get token value by path
 */
export function getTokenValue<T = any>(path: TokenPath): T {
  // This would be implemented to resolve token values
  // For now, it's a placeholder for type checking
  return undefined as T;
}

/**
 * Check if a path is a core token
 */
export function isCoreTokenPath(path: string): path is CoreTokenPath {
  return path.startsWith('core.');
}

/**
 * Check if a path is a semantic token
 */
export function isSemanticTokenPath(path: string): path is SemanticTokenPath {
  return path.startsWith('semantic.');
}

/**
 * Check if a path is a component token
 */
export function isComponentTokenPath(path: string): path is ComponentTokenPath {
  return path.startsWith('component.');
}
