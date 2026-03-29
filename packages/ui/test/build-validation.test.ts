import { describe, it, expect } from 'vitest';

describe('Build Validation', () => {
  it('should validate package structure exists', () => {
    // Test that the package structure is correct
    const fs = require('fs');
    const path = require('path');
    
    const packagePath = path.join(__dirname, '..');
    
    // Check that key directories exist
    expect(fs.existsSync(path.join(packagePath, 'src'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'styles'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'types'))).toBe(true);
    
    // Check that component files exist
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'button.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'input.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'box.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'text.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'icon.tsx'))).toBe(true);
    
    // Check that CSS files exist
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'button.css.ts'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'input.css.ts'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'box.css.ts'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'text.css.ts'))).toBe(true);
    expect(fs.existsSync(path.join(packagePath, 'src', 'primitives', 'icon.css.ts'))).toBe(true);
  });

  it('should validate package.json configuration', () => {
    const packageJson = require('../package.json');
    
    expect(packageJson.name).toBe('@repo/ui');
    expect(packageJson.main).toBeDefined();
    expect(packageJson.module).toBeDefined();
    expect(packageJson.types).toBeDefined();
    expect(packageJson.exports).toBeDefined();
  });

  it('should validate TypeScript configuration', () => {
    const tsConfig = require('../tsconfig.json');
    
    expect(tsConfig.compilerOptions).toBeDefined();
    expect(tsConfig.compilerOptions.strict).toBe(true);
    expect(tsConfig.compilerOptions.declaration).toBe(true);
  });
});
