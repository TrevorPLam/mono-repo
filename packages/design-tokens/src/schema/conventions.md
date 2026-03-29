# Design Token Naming Conventions

This document defines the naming conventions and semantic layering system for the marketing firm design tokens.

## Three-Layer Architecture

We follow a three-layer token architecture: **Primitive → Semantic → Component**

### Layer 1: Primitive Tokens
Raw, atomic values that represent the base design decisions.

**Naming Pattern**: `{category}-{subcategory}-{scale}`

**Examples**:
- `color-blue-500` (Raw blue color at 500 scale)
- `font-size-base` (Base font size)
- `space-4` (4 units of spacing)
- `radius-md` (Medium border radius)

### Layer 2: Semantic Tokens
Purpose-driven tokens that assign meaning to primitive values.

**Naming Pattern**: `{purpose}-{modifier?}-{state?}`

**Examples**:
- `color-primary` (Primary brand color)
- `color-primary-hover` (Primary color in hover state)
- `text-body-large` (Large body text style)
- `space-component-padding-x` (Horizontal padding for components)

### Layer 3: Component Tokens
Scoped tokens specific to UI components (typically CSS custom properties).

**Naming Pattern**: `--{component}-{property}`

**Examples**:
- `--btn-bg` (Button background)
- `--btn-bg-hover` (Button background on hover)
- `--card-shadow` (Card shadow)

## Token Categories

### Colors

#### Primitive Colors
- **Format**: `color-{hue}-{scale}`
- **Scales**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- **Hues**: blue, gray, red, green, yellow, orange, purple, pink
- **Special**: white, black, transparent

#### Semantic Colors
- **Brand**: `color-primary`, `color-secondary`, `color-accent`
- **States**: Add `-hover`, `-active`, `-foreground` modifiers
- **Background**: `color-background`, `color-background-secondary`
- **Surface**: `color-surface`, `color-surface-hover`
- **Text**: `color-text-primary`, `color-text-secondary`, `color-text-muted`
- **Border**: `color-border`, `color-border-hover`
- **Status**: `color-success`, `color-warning`, `color-error`, `color-info`

### Typography

#### Primitive Typography
- **Font Families**: `font-family-{category}` (sans, serif, mono, display)
- **Font Sizes**: `font-size-{scale}` (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
- **Font Weights**: `font-weight-{name}` (thin, light, normal, medium, semibold, bold, extrabold, black)
- **Line Heights**: `line-height-{name}` (none, tight, snug, normal, relaxed, loose)
- **Letter Spacing**: `letter-spacing-{name}` (tighter, tight, normal, wide, wider, widest)

#### Semantic Typography
- **Text Styles**: `text-{purpose}-{size?}` (body-large, body-medium, body-small, heading-1, heading-2, etc.)
- **Special**: `text-caption`, `text-overline`, `text-label`, `text-code`, `text-quote`

### Spacing

#### Primitive Spacing
- **Format**: `space-{scale}`
- **Base**: 4px scale system
- **Special**: `space-px`, `space-0`
- **Fractions**: `space-0_5`, `space-1_5`, `space-2_5`, `space-3_5`

#### Semantic Spacing
- **Components**: `space-component-{property}` (padding-x, padding-y, margin-x, margin-y)
- **Layout**: `space-section-{property}`, `space-container-{property}`
- **Gaps**: `space-gap`, `space-gap-sm`, `space-gap-lg`

### Sizing

#### Primitive Sizing
- **Format**: `size-{scale}`
- **Same scale as spacing** for consistency

#### Semantic Sizing
- **Components**: `size-{component}-{property}` (button-height, input-height)
- **Icons**: `size-icon-{size}` (xs, sm, md, lg, xl)
- **Containers**: `size-container-{size}` (sm, md, lg, xl, full)

### Border Radius

#### Primitive Border Radius
- **Format**: `radius-{name}` (none, sm, base, md, lg, xl, 2xl, 3xl, full)

#### Semantic Border Radius
- **Components**: `radius-{component}` (button, input, card, modal, badge, avatar)

### Shadows

#### Primitive Shadows
- **Format**: `shadow-{size}` (sm, base, md, lg, xl, 2xl, inner, none)

#### Semantic Shadows
- **Components**: `shadow-{component}` (button, button-hover, card, card-hover, modal, dropdown, tooltip)

### Breakpoints

#### Breakpoint Tokens
- **Format**: `breakpoint-{name}` (xs, sm, md, lg, xl, 2xl)
- **Values**: Typically in rem units for responsive scaling

### Motion

#### Primitive Motion
- **Durations**: `duration-{ms}` (75, 100, 150, 200, 300, 500, 700, 1000)
- **Timing Functions**: `ease-{name}` (linear, in, out, in-out, bounce)

#### Semantic Motion
- **Components**: `motion-{component}` (button, button-hover, modal, dropdown, tooltip, page-transition)

## CSS Custom Properties Generation

When generating CSS custom properties, we follow these patterns:

### Primitive Variables
```css
:root {
  --color-blue-500: #3b82f6;
  --font-size-base: 1rem;
  --space-4: 1rem;
  --radius-md: 8px;
}
```

### Semantic Variables
```css
:root {
  --color-primary: var(--color-blue-500);
  --color-primary-hover: var(--color-blue-600);
  --text-body-large: var(--font-size-base);
  --space-component-padding: var(--space-4);
}
```

### Component Variables
```css
.btn {
  --btn-bg: var(--color-primary);
  --btn-bg-hover: var(--color-primary-hover);
  --btn-padding: var(--space-component-padding);
  --btn-radius: var(--radius-button);
}
```

## Theme Inheritance

Themes can extend other themes using the `extends` property:

```typescript
const darkTheme = {
  name: 'dark',
  displayName: 'Dark Theme',
  extends: ['base'], // Extends the base theme
  tokens: {
    semantic: {
      colors: {
        // Override only the semantic layer
        'color-background': '#111827',
        'color-text-primary': '#f9fafb',
      }
    }
  }
};
```

## Validation Rules

### Color Validation
- Must be valid CSS color values
- Semantic colors must reference primitive colors
- WCAG 2.1 AA contrast ratios must be maintained

### Typography Validation
- Font families must be valid CSS font stacks
- Font sizes must use relative units (rem, em, %)
- Line heights must be unitless or use valid CSS units

### Spacing/Sizing Validation
- Must use valid CSS length units
- Should follow the 4px base scale for consistency
- Container sizes should be reasonable for responsive design

### Accessibility Considerations
- All text must have sufficient contrast against backgrounds
- Motion tokens should respect prefers-reduced-motion
- Typography scales should be responsive and accessible

## Best Practices

1. **Consistency**: Follow the established naming patterns strictly
2. **Semantics**: Use semantic tokens that describe purpose, not appearance
3. **Hierarchy**: Maintain clear separation between primitive, semantic, and component layers
4. **Documentation**: Document the purpose of each semantic token
5. **Testing**: Validate all tokens with automated tests
6. **Accessibility**: Ensure all design decisions meet WCAG 2.1 AA standards
7. **Performance**: Keep token sets minimal and focused
8. **Maintainability**: Design for easy extension and modification

## Migration Guide

When adding new tokens:

1. **Add Primitive**: Define the base value in the primitive layer
2. **Add Semantic**: Create semantic tokens that reference primitives
3. **Update Documentation**: Document the purpose and usage
4. **Add Tests**: Write validation tests for the new tokens
5. **Update CSS Generation**: Ensure CSS custom properties are generated
6. **Test Integration**: Verify the tokens work in consuming applications

When modifying existing tokens:

1. **Check Dependencies**: Verify what components use the token
2. **Semantic Impact**: Consider the effect on semantic tokens
3. **Theme Compatibility**: Ensure all themes continue to work
4. **Accessibility**: Re-validate contrast ratios and accessibility
5. **Version Control**: Use semantic versioning for breaking changes
