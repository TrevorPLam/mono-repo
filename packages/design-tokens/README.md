# @repo/design-tokens

Design token infrastructure for the marketing firm monorepo, providing a centralized, type-safe token architecture with CSS custom properties generation and multi-theme support.

## Installation

```bash
pnpm add @repo/design-tokens
```

## Usage

### TypeScript Consumption

```typescript
import { tokens } from '@repo/design-tokens';

const primaryColor = tokens.colors.primary[500];
const spacingMedium = tokens.spacing.md;
```

### CSS Custom Properties

The package generates CSS custom properties for framework-agnostic consumption:

```css
.component {
  color: var(--color-primary-500);
  padding: var(--spacing-md);
}
```

### Theme Integration

```typescript
import { createTheme } from '@repo/design-tokens';

const clientTheme = createTheme({
  colors: {
    primary: { 500: '#client-brand-color' }
  }
});
```

## Features

- **TypeScript-first** with strict typing and Zod validation
- **Three-layer token architecture** (primitive → semantic → component)
- **CSS custom properties** generation for runtime consumption
- **Multi-theme support** for brand variations and client customization
- **Accessibility-compliant** color contrast ratios
- **Build-time validation** with comprehensive error reporting

## Architecture

### Token Categories

- **Color Tokens**: Primary/secondary/tertiary scales, semantic mappings, brand variations
- **Typography Tokens**: Font families, responsive text scales, spacing, weights
- **Spacing Tokens**: 4px-based spacing scale, layout grid spacing
- **Sizing Tokens**: Component dimensions, border radii, icon scales
- **Shadow Tokens**: Elevation-based shadows, interactive states
- **Breakpoint Tokens**: Responsive breakpoint definitions

### Build System

- **Source**: TypeScript token definitions
- **Validation**: Zod schema validation
- **Transformation**: Multiple output formats (ESM, CJS, CSS)
- **Output**: Optimized packages for consumption

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## Integration

This package is designed to integrate with:

- **@repo/ui** - Primary consumer for UI components
- **@repo/contracts** - Shared validation patterns
- **@repo/env** - Environment-specific configurations

## License

Private package for internal use within the monorepo.
