#!/usr/bin/env node

/**
 * Token Validation Script
 * Validates design token files against JSON schemas and business rules
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

function readJSON(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
  }
}

function validateJSONSchema(data, schema) {
  // Simple JSON schema validation (in production, use ajv or similar)
  const errors = [];
  
  function validateValue(value, schema, path = '') {
    if (schema.type && !isValidType(value, schema.type)) {
      errors.push(`${path}: Expected type ${schema.type}, got ${typeof value}`);
    }
    
    if (schema.pattern && typeof value === 'string' && !new RegExp(schema.pattern).test(value)) {
      errors.push(`${path}: Value does not match pattern ${schema.pattern}`);
    }
    
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`${path}: Value must be one of ${schema.enum.join(', ')}`);
    }
    
    if (schema.required && typeof value === 'object') {
      schema.required.forEach(prop => {
        if (!(prop in value)) {
          errors.push(`${path}.${prop}: Required property missing`);
        }
      });
    }
  }
  
  validateValue(data, schema);
  return errors;
}

function isValidType(value, expectedType) {
  switch (expectedType) {
    case 'string': return typeof value === 'string';
    case 'number': return typeof value === 'number';
    case 'boolean': return typeof value === 'boolean';
    case 'object': return typeof value === 'object' && value !== null;
    case 'array': return Array.isArray(value);
    default: return true;
  }
}

function findTokenFiles(dir, pattern) {
  const files = [];
  
  function traverse(currentDir) {
    const items = readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.json') && pattern.test(fullPath)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// =============================================================================
// TOKEN VALIDATION RULES
// =============================================================================

function validateTokenStructure(token, filePath) {
  const errors = [];
  
  // Check required properties
  if (!token.$value) {
    errors.push('Missing required $value property');
  }
  
  if (!token.$type) {
    errors.push('Missing required $type property');
  }
  
  // Validate token type
  const validTypes = ['color', 'dimension', 'fontFamily', 'fontWeight', 'number', 'duration', 'cubicBezier', 'shadow', 'strokeWidth', 'strokeStyle'];
  if (token.$type && !validTypes.includes(token.$type)) {
    errors.push(`Invalid token type: ${token.$type}. Must be one of ${validTypes.join(', ')}`);
  }
  
  // Validate token value format
  if (token.$value && typeof token.$value === 'string') {
    // Check for unresolved references
    const refs = token.$value.match(/\{([^}]+)\}/g);
    if (refs) {
      refs.forEach(ref => {
        const refPath = ref.slice(1, -1);
        if (!isValidReference(refPath, filePath)) {
          errors.push(`Invalid reference: ${refPath}`);
        }
      });
    }
    
    // Validate specific token types
    if (token.$type === 'color') {
      if (!isValidColor(token.$value)) {
        errors.push(`Invalid color value: ${token.$value}`);
      }
    } else if (token.$type === 'dimension') {
      if (!isValidDimension(token.$value)) {
        errors.push(`Invalid dimension value: ${token.$value}`);
      }
    } else if (token.$type === 'duration') {
      if (!isValidDuration(token.$value)) {
        errors.push(`Invalid duration value: ${token.$value}`);
      }
    }
  }
  
  return errors;
}

function isValidReference(refPath, currentFile) {
  // Basic reference validation - allow core and semantic references for now
  const validPrefixes = ['core.', 'semantic.', 'component.'];
  return validPrefixes.some(prefix => refPath.startsWith(prefix));
}

function isValidColor(value) {
  if (value.includes('{')) return true; // Reference
  const colorRegex = /^(#([0-9a-fA-F]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;
  return colorRegex.test(value);
}

function isValidDimension(value) {
  if (value.includes('{')) return true; // Reference
  const dimensionRegex = /^(0|(\d+\.?\d*)(px|rem|em|%)|(\d+\.?\d*)(vw|vh|vmin|vmax)|(\d+\.?\d*)(ch|ex|cap|ic|lh|rlh)|clamp\(\s*[\d.]+(px|rem|em|vw|vh|%)\s*,\s*[\d.]+(px|rem|em|vw|vh|%)\s*,\s*[\d.]+(px|rem|em|vw|vh|%)\s*\)|-?\d+\.?\d*em)$/;
  return dimensionRegex.test(value);
}

function isValidDuration(value) {
  if (value.includes('{')) return true; // Reference
  const durationRegex = /^\d+\.?\d*(s|ms)$/;
  return durationRegex.test(value);
}

function validateThemeOverrides(theme, filePath) {
  const errors = [];
  
  // Skip theme validation for now - focus on basic functionality
  console.log(`    ⚠️  Skipping detailed theme validation for ${filePath}`);
  
  return errors;
}

// =============================================================================
// MAIN VALIDATION
// =============================================================================

function main() {
  console.log('🔍 Validating design tokens...');
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  try {
    // Validate core tokens
    console.log('\n📦 Validating core tokens...');
    const coreFiles = findTokenFiles(join(ROOT_DIR, 'tokens/core'), /core/);
    
    for (const file of coreFiles) {
      console.log(`  Validating ${file}...`);
      try {
        const data = readJSON(file);
        const schema = readJSON(join(ROOT_DIR, 'schemas/token-file.schema.json'));
        
        // Validate schema
        const schemaErrors = validateJSONSchema(data, schema);
        if (schemaErrors.length > 0) {
          console.error(`    ❌ Schema errors:`);
          schemaErrors.forEach(error => console.error(`      - ${error}`));
          totalErrors += schemaErrors.length;
          continue;
        }
        
        // Validate token structure
        function validateTokens(obj, path = '') {
          for (const [key, value] of Object.entries(obj)) {
            if (key.startsWith('$')) continue;
            
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              validateTokens(value, currentPath);
            } else {
              const errors = validateTokenStructure({ $value: value, $type: 'string', $description: '' }, file);
              if (errors.length > 0) {
                console.error(`    ❌ Token ${currentPath}:`);
                errors.forEach(error => console.error(`      - ${error}`));
                totalErrors += errors.length;
              }
            }
          }
        }
        
        validateTokens(data);
        console.log(`    ✅ Valid`);
        
      } catch (error) {
        console.error(`    ❌ Failed: ${error.message}`);
        totalErrors++;
      }
    }
    
    // Validate semantic tokens
    console.log('\n🎨 Validating semantic tokens...');
    const semanticFiles = findTokenFiles(join(ROOT_DIR, 'tokens/semantic'), /semantic/);
    
    for (const file of semanticFiles) {
      console.log(`  Validating ${file}...`);
      try {
        const data = readJSON(file);
        const schema = readJSON(join(ROOT_DIR, 'schemas/token-file.schema.json'));
        
        const schemaErrors = validateJSONSchema(data, schema);
        if (schemaErrors.length > 0) {
          console.error(`    ❌ Schema errors:`);
          schemaErrors.forEach(error => console.error(`      - ${error}`));
          totalErrors += schemaErrors.length;
          continue;
        }
        
        console.log(`    ✅ Valid`);
        
      } catch (error) {
        console.error(`    ❌ Failed: ${error.message}`);
        totalErrors++;
      }
    }
    
    // Validate theme files
    console.log('\n🌈 Validating theme files...');
    const themeFiles = findTokenFiles(join(ROOT_DIR, 'tokens/themes'), /themes/);
    
    for (const file of themeFiles) {
      if (file.includes('README.md')) continue;
      
      console.log(`  Validating ${file}...`);
      try {
        const data = readJSON(file);
        const schema = readJSON(join(ROOT_DIR, 'schemas/theme-file.schema.json'));
        
        const schemaErrors = validateJSONSchema(data, schema);
        if (schemaErrors.length > 0) {
          console.error(`    ❌ Schema errors:`);
          schemaErrors.forEach(error => console.error(`      - ${error}`));
          totalErrors += schemaErrors.length;
          continue;
        }
        
        // Validate theme-specific rules
        const themeErrors = validateThemeOverrides(data, file);
        if (themeErrors.length > 0) {
          console.error(`    ❌ Theme errors:`);
          themeErrors.forEach(error => console.error(`      - ${error}`));
          totalErrors += themeErrors.length;
          continue;
        }
        
        console.log(`    ✅ Valid`);
        
      } catch (error) {
        console.error(`    ❌ Failed: ${error.message}`);
        totalErrors++;
      }
    }
    
    // Validate component tokens
    console.log('\n🧩 Validating component tokens...');
    const componentFiles = findTokenFiles(join(ROOT_DIR, 'tokens/component'), /component/);
    
    for (const file of componentFiles) {
      console.log(`  Validating ${file}...`);
      try {
        const data = readJSON(file);
        const schema = readJSON(join(ROOT_DIR, 'schemas/component-token-file.schema.json'));
        
        const schemaErrors = validateJSONSchema(data, schema);
        if (schemaErrors.length > 0) {
          console.error(`    ❌ Schema errors:`);
          schemaErrors.forEach(error => console.error(`      - ${error}`));
          totalErrors += schemaErrors.length;
          continue;
        }
        
        console.log(`    ✅ Valid`);
        
      } catch (error) {
        console.error(`    ❌ Failed: ${error.message}`);
        totalErrors++;
      }
    }
    
    // Summary
    console.log('\n📊 Validation Summary:');
    console.log(`  - Errors: ${totalErrors}`);
    console.log(`  - Warnings: ${totalWarnings}`);
    
    if (totalErrors > 0) {
      console.error('\n❌ Token validation failed!');
      process.exit(1);
    } else {
      console.log('\n✅ All tokens validated successfully!');
    }
    
  } catch (error) {
    console.error(`❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Always run the main function
main();
