#!/usr/bin/env node

/**
 * CSS Generation Script
 * Generates CSS custom properties from design tokens
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { generateDesignTokensCSS, validateGeneratedCSS } from '../src/utils/css-generator';
import { designTokens } from '../src/tokens';

const OUTPUT_DIR = join(process.cwd(), 'dist');
const CSS_FILE = join(OUTPUT_DIR, 'variables.css');

function main() {
  console.log('🎨 Generating CSS custom properties from design tokens...');

  try {
    // Ensure output directory exists
    mkdirSync(dirname(CSS_FILE), { recursive: true });

    // Generate CSS with modern best practices
    const { css, variableMap } = generateDesignTokensCSS({
      includePrimitives: true,
      includeSemantics: true,
      includeComments: true,
      includeTypedProperties: true, // Enable @property rules for type safety
      minify: false, // Keep readable for development
    });

    // Validate generated CSS
    const validation = validateGeneratedCSS(css);
    
    if (!validation.isValid) {
      console.error('❌ CSS validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      process.exit(1);
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ CSS validation warnings:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    // Write CSS file
    writeFileSync(CSS_FILE, css, 'utf8');
    
    console.log(`✅ CSS generated successfully: ${CSS_FILE}`);
    console.log(`📊 Generated ${Object.keys(variableMap).length} CSS custom properties`);
    
    // Generate minified version for production
    const { css: minifiedCSS } = generateDesignTokensCSS({
      includePrimitives: true,
      includeSemantics: true,
      includeComments: false,
      includeTypedProperties: false, // Skip @property in production for smaller size
      minify: true,
    });

    const MINIFIED_FILE = join(OUTPUT_DIR, 'variables.min.css');
    writeFileSync(MINIFIED_FILE, minifiedCSS, 'utf8');
    console.log(`🗜️ Minified CSS generated: ${MINIFIED_FILE}`);

    // Generate variable map for documentation
    const MAP_FILE = join(OUTPUT_DIR, 'variable-map.json');
    writeFileSync(MAP_FILE, JSON.stringify(variableMap, null, 2), 'utf8');
    console.log(`📋 Variable map generated: ${MAP_FILE}`);

  } catch (error) {
    console.error('❌ Failed to generate CSS:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
