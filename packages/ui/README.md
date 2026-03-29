# @repo/ui

Shared React UI system package for the monorepo.

## What this package provides

- **Reusable low-level UI primitives** - Button, Input, Box, and more
- **Reusable design-system components** - Card, Badge, Alert, and more  
- **Reusable structural patterns** - Page headers, filter bars, and more
- **Shared UI-only hooks** - useControllableState, useMediaQuery, and more
- **Minimal shared UI infrastructure providers** - Theme and toast providers
- **Token-aligned styling glue** - Bridge to @repo/design-tokens
- **Storybook stories for all stable shared surfaces**
- **Package-local UI behavior/accessibility tests**

## What does NOT belong here

- App features or product workflows
- Business/domain components
- Data fetching, auth/session logic, server-only code
- Route-aware logic, analytics side effects, integration logic
- React Native or Expo UI
- Universal UI for every framework in the repo

## Framework scope

This is a **React web package** primarily for:
- Next.js app/product surfaces
- React islands embedded inside Astro (when interactive shared UI is actually needed)

**Not for:**
- Universal UI layer for all Astro templates
- Web-and-native shared component system
- Framework-neutral presentation abstraction

## Installation

```bash
pnpm add @repo/ui
```

## Usage

### Primitives

```tsx
import { Button, Input, Box } from '@repo/ui';

function Example() {
  return (
    <Box p="md" display="flex" gap="sm">
      <Button tone="primary" size="md">
        Click me
      </Button>
      <Input 
        placeholder="Enter text..." 
        size="md" 
        tone="neutral" 
      />
    </Box>
  );
}
```

### Design Tokens

```tsx
import { tokens, colors, spacing } from '@repo/ui';

// Use design tokens directly
const styles = {
  backgroundColor: colors.background.primary,
  padding: spacing.md,
  color: colors.foreground.primary,
};
```

## Component API

### Button

```tsx
interface ButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### Input

```tsx
interface InputProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  state?: 'default' | 'error' | 'success';
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### Box

```tsx
interface BoxProps {
  // Layout
  display?: 'block' | 'inlineBlock' | 'flex' | 'grid' | 'none';
  width?: string | number;
  height?: string | number;
  
  // Spacing (token-based)
  p?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  px?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  py?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  m?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  mx?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  my?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  
  // Flexbox
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'space-between';
  alignItems?: 'flex-start' | 'center' | 'stretch';
  
  // Polymorphic
  as?: keyof JSX.IntrinsicElements;
}
```

## Styling System

This package uses **vanilla-extract** for styling with **@repo/design-tokens** as the single source of truth.

### Token Categories

- **Colors**: `colors.background.primary`, `colors.accent.primary`, `colors.status.success`
- **Typography**: `typography.fontSize.md`, `typography.fontWeight.medium`
- **Spacing**: `spacing.sm`, `spacing.md`, `spacing.lg` (4px base scale)
- **Sizing**: `sizing.sm`, `sizing.md`, `sizing.lg`
- **Border Radius**: `borderRadius.sm`, `borderRadius.md`, `borderRadius.lg`

### Theme Support

Components support multiple themes through the design token system. Theme switching is handled at the app level, not forced within the UI package.

## Development

### Storybook

```bash
pnpm storybook
```

Visit http://localhost:6006 to see all components and their variants.

### Build

```bash
pnpm build
```

### Testing

```bash
pnpm test          # Run tests
pnpm test:watch    # Watch mode
pnpm test:coverage # Coverage report
```

### Type Checking

```bash
pnpm typecheck
```

## Architecture Principles

1. **Token-aligned**: All styling consumes from @repo/design-tokens
2. **Semantic HTML first**: Use appropriate HTML elements
3. **Accessibility**: WCAG 2.1 AA compliance minimum
4. **Server/client boundaries**: Explicit about React Server Components
5. **Minimal abstraction**: Keep components focused and composable
6. **Type safety**: Strict TypeScript with comprehensive type definitions

## Public API

### Entry Points

- `@repo/ui` - Root exports (server-safe only)
- `@repo/ui/primitives` - Low-level primitives
- `@repo/ui/components` - Server-safe components
- `@repo/ui/components/*` - Component families (client-only where needed)
- `@repo/ui/hooks` - Client-only hooks
- `@repo/ui/providers` - Client-only providers
- `@repo/ui/styles` - Styling utilities and tokens

### Forbidden Imports

```tsx
// ❌ Never import internal files
import { Button } from '@repo/ui/src/primitives/button';

// ❌ Never deep import component internals
import { Button } from '@repo/ui/components/button/button';

// ✅ Use curated public entrypoints
import { Button } from '@repo/ui';
import { Button } from '@repo/ui/primitives';
```

## Dependencies

### Runtime Dependencies
- `react` & `react-dom` - Peer dependencies
- `@repo/design-tokens` - Design token system
- `@vanilla-extract/*` - CSS-in-JS with type safety
- `@radix-ui/*` - Accessibility primitives (selective use)

### Development Dependencies  
- `typescript` - Type checking
- `vitest` - Unit testing
- `@storybook/*` - Component development
- `chromatic` - Visual testing

## Contributing

1. Follow the canonical structure in `ui-canonical.md`
2. Add stories for all new components
3. Include accessibility tests
4. Update this README for public API changes
5. Ensure all exports are properly typed

## License

Private package - internal use only.
