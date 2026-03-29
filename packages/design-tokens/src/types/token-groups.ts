/**
 * Token group metadata and categorization
 */

export const TOKEN_GROUPS = {
  // Core token groups
  CORE_COLORS: 'colors',
  CORE_SPACING: 'spacing',
  CORE_TYPOGRAPHY: 'typography',
  CORE_DIMENSIONS: 'dimensions',
  CORE_EFFECTS: 'effects',
  
  // Semantic token groups
  SEMANTIC_COLORS: 'colors',
  SEMANTIC_SURFACES: 'surfaces',
  SEMANTIC_TEXT: 'text',
  SEMANTIC_INTERACTIVE: 'interactive',
  SEMANTIC_STATES: 'states',
  
  // Component token groups
  COMPONENT_GEOMETRY: 'geometry',
  COMPONENT_STATES: 'states',
  COMPONENT_INTERACTIONS: 'interactions',
  
  // Theme groups
  THEME_BASE: 'base',
  THEME_BRAND: 'brand',
  THEME_CUSTOM: 'custom'
} as const;

export const TOKEN_CATEGORIES = {
  PRIMITIVE: 'primitive',
  SEMANTIC: 'semantic',
  COMPONENT: 'component',
  THEME: 'theme'
} as const;
