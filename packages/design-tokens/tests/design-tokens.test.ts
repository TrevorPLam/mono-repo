/**
 * Basic tests for design tokens functionality
 */

import { describe, it, expect } from 'vitest';

describe('Design Tokens Generation', () => {
  it('should generate CSS files', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const generatedDir = path.resolve(__dirname, '../src/generated');
    const tokensCss = path.join(generatedDir, 'tokens.css');
    
    expect(fs.existsSync(tokensCss)).toBe(true);
    
    const content = fs.readFileSync(tokensCss, 'utf8');
    expect(content).toContain('--repo-core-color-blue-500');
    expect(content).toContain('--repo-semantic-text-primary');
    expect(content).toContain('--repo-component-button-height');
    expect(content).toContain('@property');
  });

  it('should generate expected number of tokens', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const generatedDir = path.resolve(__dirname, '../src/generated');
    const tokensCss = path.join(generatedDir, 'tokens.css');
    
    const content = fs.readFileSync(tokensCss, 'utf8');
    const tokenMatches = content.match(/--repo-[a-z-]+:/g);
    
    // Should have around 300 tokens (current implementation count)
    expect(tokenMatches).toHaveLength(300);
  });

  it('should have proper token references', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const generatedDir = path.resolve(__dirname, '../src/generated');
    const tokensCss = path.join(generatedDir, 'tokens.css');
    
    const content = fs.readFileSync(tokensCss, 'utf8');
    
    // Semantic tokens should reference core tokens
    expect(content).toContain('var(--repo-core-color');
    
    // Component tokens should reference core/semantic tokens
    expect(content).toContain('var(--repo-core-spacing)');
    expect(content).toContain('var(--repo-core-radius)');
  });
});

describe('Token Validation', () => {
  it('should validate token files without errors', async () => {
    const { execSync } = await import('child_process');
    
    try {
      const output = execSync('node scripts/validate-tokens.mjs', {
        cwd: process.cwd(),
        encoding: 'utf8'
      });
      
      expect(output).toContain('✅ All tokens validated successfully');
    } catch (error) {
      expect.fail(`Token validation failed: ${error}`);
    }
  });
});

describe('Package Exports', () => {
  it('should export CSS utilities', async () => {
    const cssModule = await import('../src/css/index');
    expect(cssModule.selectors).toBeDefined();
    expect(cssModule.getThemeSelector).toBeDefined();
    expect(cssModule.createCSSVar).toBeDefined();
    expect(cssModule.getCSSVar).toBeDefined();
  });

  it('should export TypeScript utilities', async () => {
    const tsModule = await import('../src/ts/index');
    expect(tsModule.tokenPaths).toBeDefined();
    expect(tsModule.tokenGroups).toBeDefined();
    expect(tsModule.tokenTypes).toBeDefined();
  });

  it('should export theme utilities', async () => {
    const themeModule = await import('../src/themes/index');
    expect(themeModule.themeRegistry).toBeDefined();
    expect(themeModule.tokenResolver).toBeDefined();
    expect(themeModule.defaultLightTheme).toBeDefined();
    expect(themeModule.darkTheme).toBeDefined();
  });
});
