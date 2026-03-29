# Tenant Theming Governance

## Overview

This directory is reserved for future tenant-specific theme implementations. In v1, tenant theming is documented but not implemented as token files.

## Tenant Theming Principles

### Overlay-Only Approach

- Tenant themes may only override approved semantic surfaces
- No per-tenant token trees in v1
- No per-client forks of core primitives
- Only approved semantic surfaces may be overridden

### Allowed Override Areas

Future tenant themes may override:

- `semantic.surface.*` - Surface and background colors
- `semantic.text.*` - Text color hierarchies  
- `semantic.border.*` - Border color treatments
- `semantic.icon.*` - Icon color mappings
- `semantic.focus.*` - Focus treatment colors
- `semantic.color.accent.*` - Selected accent color usage

### Forbidden Areas

Tenant themes must not override:

- Core primitives (`core.*`)
- Spacing scales (`semantic.spacing.*`)
- Typography scales (`semantic.typography.*`)
- Breakpoints (`core.breakpoints.*`)
- Motion scales (`semantic.motion.*`)
- Z-index values (`core.z-index.*`)
- Component geometry (`component.*`)

### Structural Primitives

All structural primitives remain shared across tenants:

- Spacing scale
- Typography scale
- Breakpoint definitions
- Motion definitions
- Z-index layering

## Implementation Guidelines (Future)

When implementing tenant themes in future versions:

1. **Naming Convention**: `{client-name}.json`
2. **Validation**: Must pass semantic override validation
3. **Review**: Requires architecture committee approval
4. **Documentation**: Must document all deviations from base theme

## Example Future Structure

```text
tokens/themes/tenants/
├── README.md                 # This file
├── client-acme.json         # ACME Corporation theme
├── client-global.json       # Global Industries theme  
└── client-startup.json      # Startup Co theme
```

## Migration Path

Future tenant theming implementation will follow this sequence:

1. Define tenant theme schema validation
2. Implement tenant theme build pipeline
3. Create tenant theme consumption patterns
4. Add tenant theme governance workflows

---

*This governance ensures brand consistency while allowing for controlled tenant customization.*
