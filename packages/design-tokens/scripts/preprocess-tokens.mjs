#!/usr/bin/env node

/**
 * Token Preprocessing Script
 * Resolves token references before Style Dictionary processing
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

// Simple token reference resolver
function resolveTokenReferences(obj, context = {}) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveTokenReferences(item, context));
  }

  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$value' && typeof value === 'string' && value.includes('{')) {
      // Resolve reference like {core.color.blue.500}
      const reference = value.match(/^\{([^}]+)\}$/);
      if (reference) {
        const refPath = reference[1].split('.');
        let resolved = context;
        
        // Try to resolve from context
        try {
          for (const part of refPath) {
            resolved = resolved[part];
          }
          result[key] = resolved;
        } catch (e) {
          // If resolution fails, keep original reference
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    } else if (key === '$value' || key === '$type' || key === '$description') {
      result[key] = value;
    } else {
      // Recursively process nested objects
      result[key] = resolveTokenReferences(value, context);
    }
  }
  
  return result;
}

// Load and process tokens
function loadTokens(dir) {
  const tokens = {};
  
  function processFile(filePath, category) {
    if (!existsSync(filePath)) return;
    
    try {
      const content = readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      if (!tokens[category]) {
        tokens[category] = {};
      }
      
      Object.assign(tokens[category], data);
    } catch (error) {
      console.warn(`Failed to process ${filePath}:`, error.message);
    }
  }
  
  // Process core tokens first (they don't have references)
  const coreDir = join(ROOT_DIR, 'tokens/core');
  if (existsSync(coreDir)) {
    const fs = require('fs');
    const files = fs.readdirSync(coreDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const filePath = join(coreDir, file);
      const content = readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      if (!tokens.core) tokens.core = {};
      Object.assign(tokens.core, data);
    }
  }
  
  // Process semantic tokens (resolve references to core)
  const semanticDir = join(ROOT_DIR, 'tokens/semantic');
  if (existsSync(semanticDir)) {
    const fs = require('fs');
    const files = fs.readdirSync(semanticDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const filePath = join(semanticDir, file);
      const content = readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      if (!tokens.semantic) tokens.semantic = {};
      
      // Resolve references
      const resolved = resolveTokenReferences(data, tokens);
      Object.assign(tokens.semantic, resolved);
    }
  }
  
  // Process component tokens
  const componentDir = join(ROOT_DIR, 'tokens/component');
  if (existsSync(componentDir)) {
    const fs = require('fs');
    const files = fs.readdirSync(componentDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const filePath = join(componentDir, file);
      const content = readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      if (!tokens.component) tokens.component = {};
      
      // Resolve references
      const resolved = resolveTokenReferences(data, tokens);
      Object.assign(tokens.component, resolved);
    }
  }
  
  return tokens;
}

// Write processed tokens to temporary files for Style Dictionary
function writeProcessedTokens(tokens) {
  const outputDir = join(ROOT_DIR, '.tokens-temp');
  
  // Create output directory
  if (!existsSync(outputDir)) {
    require('fs').mkdirSync(outputDir, { recursive: true });
  }
  
  // Write each category
  for (const [category, data] of Object.entries(tokens)) {
    const filePath = join(outputDir, `${category}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
  
  return outputDir;
}

// Main execution
try {
  console.log('🔄 Preprocessing design tokens...');
  
  const tokens = loadTokens();
  const tempDir = writeProcessedTokens(tokens);
  
  console.log(`✅ Tokens preprocessed to ${tempDir}`);
  console.log(`📊 Processed ${Object.keys(tokens).length} token categories`);
  
  // Output directory for Style Dictionary to use
  console.log(tempDir);
} catch (error) {
  console.error('❌ Token preprocessing failed:', error);
  process.exit(1);
}
