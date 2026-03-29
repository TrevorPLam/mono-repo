#!/usr/bin/env node

/**
 * Simple CSS generation script
 * Generates CSS custom properties from JSON token files without reference resolution
 */

import { readFileSync, existsSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = join(ROOT_DIR, 'src/generated');

// =============================================================================
// UTILITIES
// =============================================================================

function readJSON(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to read JSON file ${filePath}: ${error.message}`);
    return {};
  }
}

function findTokenFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    if (!existsSync(currentDir)) return;
    
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function processTokenValue(value) {
  if (typeof value === 'string' && value.includes('{')) {
    // For now, keep references as-is - they'll be resolved by CSS custom properties
    return value;
  }
  return value;
}

function generateCSS(tokens, category) {
  let css = `/* 
 * ${category.charAt(0).toUpperCase() + category.slice(1)} Design Tokens
 * Generated: ${new Date().toISOString()}
 * Framework: Framework-agnostic
 * Best Practices: CSS custom properties, semantic naming
 */

:root {
  /* ${category.charAt(0).toUpperCase() + category.slice(1)} Tokens */
`;

  function processTokens(obj, path = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (value.$value) {
          // This is a token definition
          // Include the full path for better naming
          const cssVarName = `--repo-${category}-${currentPath.join('-')}`;
          const tokenValue = processTokenValue(value.$value);
          const description = value.$description ? ` /* ${value.$description} */` : '';
          
          css += `  ${cssVarName}: ${tokenValue};${description}\n`;
        } else {
          // This is a nested object, continue processing
          processTokens(value, currentPath);
        }
      }
    }
  }

  processTokens(tokens);
  css += '}\n\n';
  return css;
}

// =============================================================================
// MAIN GENERATION
// =============================================================================

async function generateTokensCSS() {
  console.log('🎨 Generating CSS custom properties from design tokens...');
  
  try {
    // Ensure output directory exists
    if (!existsSync(OUTPUT_DIR)) {
      require('fs').mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Load all token files
    const tokensDir = join(ROOT_DIR, 'tokens');
    const tokenFiles = findTokenFiles(tokensDir);
    
    console.log(`📁 Found ${tokenFiles.length} token files`);
    
    // Organize tokens by category
    const tokensByCategory = {
      core: {},
      semantic: {},
      component: {},
      themes: {}
    };
    
    for (const filePath of tokenFiles) {
      const relativePath = filePath.replace(tokensDir, '').replace(/^[\/\\]/, '');
      const pathParts = relativePath.split(/[\/\\]/);
      const category = pathParts[0];
      const fileName = pathParts[1]?.replace('.json', '') || '';
      
      console.log(`🔍 File: ${filePath} -> Category: ${category}, File: ${fileName}`);
      
      if (tokensByCategory[category]) {
        const data = readJSON(filePath);
        console.log(`📄 Processing ${category} file: ${relativePath}`);
        
        // Always wrap the file contents in the filename for proper naming
        tokensByCategory[category][fileName] = data;
      }
    }
    
    console.log(`📊 Processed ${Object.keys(tokensByCategory).length} token categories`);
    
    // Debug: Show what we found
    for (const [category, tokens] of Object.entries(tokensByCategory)) {
      const tokenCount = Object.keys(tokens).length;
      console.log(`🔍 ${category}: ${tokenCount} top-level keys`);
      if (tokenCount > 0) {
        console.log(`   Keys: ${Object.keys(tokens).slice(0, 5).join(', ')}${tokenCount > 5 ? '...' : ''}`);
      }
    }
    
    // Generate CSS files
    const cssFiles = [
      { name: 'tokens.css', category: 'core' },
      { name: 'themes.css', category: 'semantic' },
      { name: 'global.css', category: 'all' },
      { name: 'tailwind.css', category: 'all' }
    ];
    
    for (const { name, category } of cssFiles) {
      let css = `/* 
 * Design Tokens CSS Custom Properties
 * Generated: ${new Date().toISOString()}
 * Framework: Framework-agnostic
 * Best Practices: CSS custom properties, semantic naming, theme-aware
 */

:root {
  /* Base Token Variables */
`;
      
      if (category === 'all') {
        // Include all tokens
        for (const [catName, tokens] of Object.entries(tokensByCategory)) {
          if (Object.keys(tokens).length > 0) {
            css += `\n  /* ${catName.charAt(0).toUpperCase() + catName.slice(1)} Tokens */\n`;
            
            function processAllTokens(obj, path = []) {
              for (const [key, value] of Object.entries(obj)) {
                const currentPath = [...path, key];
                
                if (typeof value === 'object' && value !== null) {
                  if (value.$value) {
                    const cssVarName = `--repo-${catName}-${currentPath.join('-')}`;
                    const tokenValue = processTokenValue(value.$value);
                    const description = value.$description ? ` /* ${value.$description} */` : '';
                    
                    css += `  ${cssVarName}: ${tokenValue};${description}\n`;
                  } else {
                    processAllTokens(value, currentPath);
                  }
                }
              }
            }
            
            processAllTokens(tokens);
          }
        }
      } else {
        // Include specific category
        const tokens = tokensByCategory[category];
        if (Object.keys(tokens).length > 0) {
          const categoryCSS = generateCSS(tokens, category);
          css = categoryCSS;
        }
      }
      
      css += '}\n';
      
      const outputPath = join(OUTPUT_DIR, name);
      writeFileSync(outputPath, css);
      console.log(`✅ Generated ${name}`);
    }
    
    // Verify files are different
    const tokensPath = join(OUTPUT_DIR, 'tokens.css');
    const themesPath = join(OUTPUT_DIR, 'themes.css');
    
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
    
    console.log('✅ CSS generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to generate CSS:', error);
    process.exit(1);
  }
}

// Run the generation
generateTokensCSS();
