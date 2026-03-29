# Chromatic Visual Testing Setup

This document describes the Chromatic visual testing configuration for the `@repo/ui` package.

## Overview

Chromatic provides automated visual regression testing for our UI components. It captures screenshots of every story in Storybook across different viewports and compares them against approved baselines to detect visual changes.

## Configuration Files

### 1. Storybook Configuration (`.storybook/preview.ts`)

```typescript
parameters: {
  chromatic: {
    // Configure Chromatic-specific settings
    viewports: [320, 768, 1024, 1440],
    disableSnapshot: false,
    pauseAnimation: true,
  },
}
```

### 2. Chromatic Configuration (`chromatic.config.ts`)

- **Build Script**: Uses `build-storybook` command
- **Viewports**: Tests at mobile (320px), tablet (768px), desktop (1024px), and wide (1440px) sizes
- **TurboSnap**: Enabled for faster builds by only testing changed stories
- **CI Optimizations**: Headless mode and verbose logging for CI environments

### 3. GitHub Actions Workflow (`.github/workflows/chromatic.yml`)

Automated workflow that:
- Triggers on pushes/PRs affecting UI package or design tokens
- Installs dependencies and builds packages
- Runs Chromatic visual tests
- Reports results back to GitHub

## Scripts

### Development
```bash
# Run Chromatic locally (requires CHROMATIC_PROJECT_TOKEN env var)
pnpm chromatic

# Build Storybook for Chromatic
pnpm build-storybook
```

### CI/CD
```bash
# Run Chromatic in CI mode (exits with 0 on changes)
pnpm chromatic:ci
```

## Environment Variables

### Required
- `CHROMATIC_PROJECT_TOKEN`: Project token from Chromatic dashboard
  - Configure in GitHub repository secrets as `CHROMATIC_PROJECT_TOKEN_UI`

### Optional
- `NODE_ENV`: Set to 'production' for optimal builds
- `CI`: Set to true for CI-specific optimizations

## Viewport Testing

Components are automatically tested at these viewport sizes:
- **Mobile**: 320px - Ensures mobile responsiveness
- **Tablet**: 768px - Tablet layout testing
- **Desktop**: 1024px - Standard desktop view
- **Wide**: 1440px - Large screen testing

## Workflow Triggers

The Chromatic workflow runs on:
- **Push events** to `main` or `develop` branches
- **Pull requests** targeting `main` or `develop` branches
- **File changes** in:
  - `packages/ui/**`
  - `packages/design-tokens/**` (dependency)
  - `.github/workflows/chromatic.yml`

## Review Process

### On Pull Requests
1. Chromatic captures screenshots of all changed stories
2. Visual differences are highlighted in the PR
3. Team members can approve or reject changes
4. PR cannot be merged until visual changes are reviewed

### On Main Branch
1. Chromatic runs visual tests to ensure no regressions
2. New baselines are automatically approved for main branch
3. Results are stored for future comparisons

## Best Practices

### Story Writing
- Write comprehensive stories covering all component states
- Include edge cases and error states
- Use controls for interactive testing
- Include accessibility testing scenarios

### Component Development
- Test components at all viewport sizes
- Ensure animations are paused for consistent screenshots
- Use semantic tokens for consistent styling
- Include proper ARIA attributes for accessibility testing

### Performance Optimization
- Use TurboSnap for faster builds (only changed stories)
- Minimize unnecessary re-renders in stories
- Optimize image and asset loading
- Keep story dependencies minimal

## Troubleshooting

### Common Issues

#### Build Failures
- Check that design tokens package is built first
- Verify all dependencies are installed
- Ensure Storybook builds successfully locally

#### Visual Test Failures
- Review visual changes in Chromatic dashboard
- Check for intentional vs. unintentional changes
- Update stories if test setup is incorrect
- Consider if changes should be approved

#### CI Issues
- Verify `CHROMATIC_PROJECT_TOKEN_UI` secret is configured
- Check workflow permissions for PR comments
- Ensure proper Node.js version and caching

### Debug Mode

Enable verbose logging for debugging:
```bash
CHROMATIC_DEBUG=true pnpm chromatic
```

## Integration with Design Tokens

The Chromatic workflow automatically builds the `@repo/design-tokens` package first to ensure:
- Latest design changes are included in visual tests
- Token updates trigger visual regression testing
- Consistent styling across component updates

## Future Enhancements

- **Cross-browser testing**: Configure Chromatic for multiple browsers
- **Component library documentation**: Auto-generate from Chromatic builds
- **Performance metrics**: Include bundle size and render performance
- **Accessibility automation**: Enhanced a11y testing integration

## Resources

- [Chromatic Documentation](https://www.chromatic.com/docs)
- [Storybook Integration](https://storybook.js.org/addons/chromatic)
- [GitHub Actions Setup](https://www.chromatic.com/docs/github-actions)
- [Visual Testing Best Practices](https://www.chromatic.com/docs/best-practices)
