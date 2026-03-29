#!/usr/bin/env node

/**
 * CSS generation script using Style Dictionary
 * Generates differentiated CSS files from design tokens
 */

import StyleDictionary from 'style-dictionary';
import { readFileSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

// =============================================================================
// STYLE DICTIONARY CONFIGURATION
// =============================================================================

const config = {
  source: [
    'tokens/core/**/*.json',
    'tokens/semantic/**/*.json', 
    'tokens/component/**/*.json',
    'tokens/themes/**/*.json'
  ],

  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/generated/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          selector: ':root',
          filter: (token) => token.path[0] === 'core',
          options: {
            showFileHeader: true,
            outputReferences: true
          }
        },
        {
          destination: 'themes.css',
          format: 'css/variables',
          selector: ':root',
          filter: (token) => token.path[0] === 'semantic',
          options: {
            showFileHeader: true,
            outputReferences: true
          }
        },
        {
          destination: 'global.css',
          format: 'css/variables',
          selector: ':root',
          options: {
            showFileHeader: true,
            outputReferences: true
          }
        },
        {
          destination: 'tailwind.css',
          format: 'css/variables',
          selector: ':root',
          options: {
            showFileHeader: true,
            outputReferences: false
          }
        }
      ]
    }
  }
};

// =============================================================================
// CUSTOM TRANSFORMS
// =============================================================================

StyleDictionary.registerTransform({
  name: 'name/css-custom-properties',
  type: 'name',
  transitive: true,
  matcher: (token) => true,
  transformer: (token) => {
    const path = token.path;
    
    // Convert path to CSS variable name with --repo- prefix
    if (path[0] === 'core') {
      return `--repo-core-${path[1]}-${path.slice(2).join('-')}`;
    } else if (path[0] === 'semantic') {
      return `--repo-semantic-${path[1]}-${path.slice(2).join('-')}`;
    } else if (path[0] === 'component') {
      return `--repo-component-${path[1]}-${path.slice(2).join('-')}`;
    } else if (path[0] === 'themes') {
      return `--repo-theme-${path[1]}-${path.slice(2).join('-')}`;
    }
    
    return `--repo-${path.join('-')}`;
  }
});

// =============================================================================
// BUILD EXECUTION
// =============================================================================

async function buildTokens() {
  console.log('🎨 Building design tokens with Style Dictionary...');
  
  try {
    // Change to package directory
    process.chdir(ROOT_DIR);
    
    // Build tokens
    const StyleDictionaryExtended = StyleDictionary.extend(config);
    await StyleDictionaryExtended.buildAllPlatforms();
    
    console.log('✅ Design tokens built successfully!');
    
    // Verify files are different
    const tokensPath = 'src/generated/tokens.css';
    const themesPath = 'src/generated/themes.css';
    
    if (existsSync(tokensPath) && existsSync(themesPath)) {
      const tokensContent = readFileSync(tokensPath, 'utf8');
      const themesContent = readFileSync(themesPath, 'utf8');
      
      if (tokensContent === themesContent) {
        console.warn('⚠️  Warning: tokens.css and themes.css are identical');
      } else {
        console.log('✅ CSS files are properly differentiated');
      }
      
      console.log(`📊 Generated ${tokensContent.split('\n').length} lines in tokens.css`);
      console.log(`📊 Generated ${themesContent.split('\n').length} lines in themes.css`);
    }
    
  } catch (error) {
    console.error('❌ Failed to build design tokens:', error);
    process.exit(1);
  }
}

// Run the build
buildTokens();
// Run the build
buildTokens();
