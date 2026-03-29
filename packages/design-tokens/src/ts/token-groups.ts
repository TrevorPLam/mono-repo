/**
 * Token group definitions
 * Provides logical groupings of related tokens
 */

export interface TokenGroup {
  name: string;
  description: string;
  tokens: string[];
}

export const coreTokenGroups: TokenGroup[] = [
  {
    name: 'colors',
    description: 'Color primitives for the design system',
    tokens: [
      'core.color.blue',
      'core.color.gray',
      'core.color.red',
      'core.color.green',
      'core.color.yellow',
      'core.color.orange',
      'core.color.purple',
      'core.color.pink',
      'core.color.white',
      'core.color.black',
      'core.color.transparent'
    ]
  },
  {
    name: 'spacing',
    description: 'Spacing scale primitives',
    tokens: [
      'core.spacing.0',
      'core.spacing.px',
      'core.spacing.0_5',
      'core.spacing.1',
      'core.spacing.2',
      'core.spacing.3',
      'core.spacing.4',
      'core.spacing.6',
      'core.spacing.8',
      'core.spacing.10',
      'core.spacing.12',
      'core.spacing.16',
      'core.spacing.20',
      'core.spacing.24'
    ]
  },
  {
    name: 'typography',
    description: 'Typography primitives',
    tokens: [
      'core.typography.fontFamily',
      'core.typography.fontSize',
      'core.typography.fontWeight',
      'core.typography.lineHeight',
      'core.typography.letterSpacing'
    ]
  },
  {
    name: 'border',
    description: 'Border primitives',
    tokens: [
      'core.border.width',
      'core.border.style'
    ]
  },
  {
    name: 'radius',
    description: 'Border radius primitives',
    tokens: [
      'core.radius.none',
      'core.radius.sm',
      'core.radius.base',
      'core.radius.md',
      'core.radius.lg',
      'core.radius.xl',
      'core.radius.2xl',
      'core.radius.3xl',
      'core.radius.full'
    ]
  },
  {
    name: 'shadows',
    description: 'Shadow primitives',
    tokens: [
      'core.shadow.xs',
      'core.shadow.sm',
      'core.shadow.base',
      'core.shadow.md',
      'core.shadow.lg',
      'core.shadow.xl',
      'core.shadow.2xl',
      'core.shadow.inner'
    ]
  },
  {
    name: 'motion',
    description: 'Motion primitives',
    tokens: [
      'core.motion.duration',
      'core.motion.easing'
    ]
  },
  {
    name: 'opacity',
    description: 'Opacity primitives',
    tokens: [
      'core.opacity.0',
      'core.opacity.5',
      'core.opacity.10',
      'core.opacity.20',
      'core.opacity.30',
      'core.opacity.40',
      'core.opacity.50',
      'core.opacity.60',
      'core.opacity.70',
      'core.opacity.80',
      'core.opacity.90',
      'core.opacity.100'
    ]
  },
  {
    name: 'size',
    description: 'Size primitives',
    tokens: [
      'core.size.icon',
      'core.size.control',
      'core.size.container'
    ]
  },
  {
    name: 'z-index',
    description: 'Z-index primitives',
    tokens: [
      'core.z-index.base',
      'core.z-index.raised',
      'core.z-index.dropdown',
      'core.z-index.sticky',
      'core.z-index.modal',
      'core.z-index.popover',
      'core.z-index.toast',
      'core.z-index.tooltip'
    ]
  },
  {
    name: 'breakpoints',
    description: 'Responsive breakpoint primitives',
    tokens: [
      'core.breakpoints.sm',
      'core.breakpoints.md',
      'core.breakpoints.lg',
      'core.breakpoints.xl',
      'core.breakpoints.2xl'
    ]
  }
];

export const semanticTokenGroups: TokenGroup[] = [
  {
    name: 'colors',
    description: 'Semantic color tokens',
    tokens: [
      'semantic.color.accent',
      'semantic.color.interactive',
      'semantic.color.success',
      'semantic.color.warning',
      'semantic.color.danger',
      'semantic.color.info',
      'semantic.color.disabled'
    ]
  },
  {
    name: 'surfaces',
    description: 'Semantic surface tokens',
    tokens: [
      'semantic.surface.canvas',
      'semantic.surface.subtle',
      'semantic.surface.elevated',
      'semantic.surface.inverse',
      'semantic.surface.interactive',
      'semantic.surface.status'
    ]
  },
  {
    name: 'text',
    description: 'Semantic text tokens',
    tokens: [
      'semantic.text.primary',
      'semantic.text.secondary',
      'semantic.text.tertiary',
      'semantic.text.muted',
      'semantic.text.subtle',
      'semantic.text.inverse',
      'semantic.text.interactive',
      'semantic.text.link',
      'semantic.text.status',
      'semantic.text.accent'
    ]
  },
  {
    name: 'borders',
    description: 'Semantic border tokens',
    tokens: [
      'semantic.border.primary',
      'semantic.border.secondary',
      'semantic.border.tertiary',
      'semantic.border.subtle',
      'semantic.border.strong',
      'semantic.border.inverse',
      'semantic.border.interactive',
      'semantic.border.focus',
      'semantic.border.status',
      'semantic.border.accent',
      'semantic.border.disabled'
    ]
  },
  {
    name: 'icons',
    description: 'Semantic icon tokens',
    tokens: [
      'semantic.icon.primary',
      'semantic.icon.secondary',
      'semantic.icon.muted',
      'semantic.icon.subtle',
      'semantic.icon.inverse',
      'semantic.icon.interactive',
      'semantic.icon.status',
      'semantic.icon.accent',
      'semantic.icon.disabled'
    ]
  },
  {
    name: 'focus',
    description: 'Semantic focus tokens',
    tokens: [
      'semantic.focus.ring',
      'semantic.focus.outline',
      'semantic.focus.visible',
      'semantic.focus.highContrast'
    ]
  },
  {
    name: 'spacing',
    description: 'Semantic spacing tokens',
    tokens: [
      'semantic.spacing.stack',
      'semantic.spacing.inline',
      'semantic.spacing.inset',
      'semantic.spacing.gap'
    ]
  },
  {
    name: 'typography',
    description: 'Semantic typography tokens',
    tokens: [
      'semantic.typography.body',
      'semantic.typography.label',
      'semantic.typography.heading',
      'semantic.typography.display'
    ]
  },
  {
    name: 'elevation',
    description: 'Semantic elevation tokens',
    tokens: [
      'semantic.elevation.resting',
      'semantic.elevation.raised',
      'semantic.elevation.overlay',
      'semantic.elevation.modal',
      'semantic.elevation.dropdown',
      'semantic.elevation.tooltip',
      'semantic.elevation.interactive',
      'semantic.elevation.card'
    ]
  },
  {
    name: 'motion',
    description: 'Semantic motion tokens',
    tokens: [
      'semantic.motion.standard',
      'semantic.motion.emphasized',
      'semantic.motion.enter',
      'semantic.motion.exit',
      'semantic.motion.interactive',
      'semantic.motion.loading',
      'semantic.motion.notification'
    ]
  }
];

export const componentTokenGroups: TokenGroup[] = [
  {
    name: 'button',
    description: 'Button component tokens',
    tokens: [
      'component.button.height',
      'component.button.padding',
      'component.button.gap',
      'component.button.radius',
      'component.button.border',
      'component.button.shadow',
      'component.button.transition'
    ]
  },
  {
    name: 'input',
    description: 'Input component tokens',
    tokens: [
      'component.input.height',
      'component.input.padding',
      'component.input.radius',
      'component.input.border',
      'component.input.focus',
      'component.input.shadow',
      'component.input.transition'
    ]
  },
  {
    name: 'card',
    description: 'Card component tokens',
    tokens: [
      'component.card.padding',
      'component.card.radius',
      'component.card.border',
      'component.card.shadow',
      'component.card.surface',
      'component.card.transition',
      'component.card.gap'
    ]
  }
];

/**
 * Get all token groups
 */
export function getAllTokenGroups(): TokenGroup[] {
  return [...coreTokenGroups, ...semanticTokenGroups, ...componentTokenGroups];
}

/**
 * Get token group by name
 */
export function getTokenGroup(name: string): TokenGroup | undefined {
  return getAllTokenGroups().find(group => group.name === name);
}

/**
 * Get tokens in a group
 */
export function getTokensInGroup(name: string): string[] {
  const group = getTokenGroup(name);
  return group ? group.tokens : [];
}
