#!/usr/bin/env node

/**
 * Advanced Token Validation Script
 * Enhanced validation with reference checking, type validation, and business rules
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

// =============================================================================
// VALIDATION RESULTS
// =============================================================================

class ValidationResult {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.stats = {
      totalTokens: 0,
      validTokens: 0,
      invalidTokens: 0,
      references: 0,
      brokenReferences: 0,
      circularReferences: 0
    };
  }

  addError(message, file = '', token = '') {
    this.errors.push({ message, file, token, type: 'error' });
  }

  addWarning(message, file = '', token = '') {
    this.warnings.push({ message, file, token, type: 'warning' });
  }

  addInfo(message, file = '', token = '') {
    this.info.push({ message, file, token, type: 'info' });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  hasWarnings() {
    return this.warnings.length > 0;
  }

  getSummary() {
    return {
      errors: this.errors.length,
      warnings: this.warnings.length,
      info: this.info.length,
      stats: this.stats
    };
  }
}

// =============================================================================
// TOKEN RESOLUTION SYSTEM
// =============================================================================

class TokenResolver {
  constructor() {
    this.tokens = new Map();
    this.references = new Map();
    this.dependencyGraph = new Map();
  }

  /**
   * Load all tokens from files
   */
  loadTokens() {
    const tokenFiles = this.findAllTokenFiles();
    
    for (const filePath of tokenFiles) {
      try {
        const content = readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        this.processTokenFile(data, filePath);
      } catch (error) {
        console.warn(`Failed to load token file ${filePath}: ${error.message}`);
      }
    }
  }

  /**
   * Find all token files
   */
  findAllTokenFiles() {
    const files = [];
    const categories = ['core', 'semantic', 'component', 'themes'];
    
    for (const category of categories) {
      const categoryDir = join(ROOT_DIR, 'tokens', category);
      if (existsSync(categoryDir)) {
        this.traverseDirectory(categoryDir, files);
      }
    }
    
    return files;
  }

  /**
   * Traverse directory recursively
   */
  traverseDirectory(dir, files) {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.traverseDirectory(fullPath, files);
      } else if (item.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }

  /**
   * Process a token file and extract tokens
   */
  processTokenFile(data, filePath) {
    this.processTokens(data, '', filePath);
  }

  /**
   * Process tokens recursively
   */
  processTokens(obj, path = '', filePath) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (key.startsWith('$')) {
        // Skip metadata
        continue;
      }
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Check if this is a token definition
        if (value.$value !== undefined) {
          this.registerToken(currentPath, value, filePath);
        } else {
          // Recursively process nested objects
          this.processTokens(value, currentPath, filePath);
        }
      } else {
        // This is a token value
        this.registerToken(currentPath, { $value: value, $type: 'string' }, filePath);
      }
    }
  }

  /**
   * Register a token
   */
  registerToken(path, token, filePath) {
    this.tokens.set(path, {
      ...token,
      path,
      file: filePath,
      category: this.getCategoryFromPath(path)
    });

    // Track references
    if (typeof token.$value === 'string' && token.$value.includes('{')) {
      const refs = this.extractReferences(token.$value);
      this.references.set(path, refs);
      
      // Build dependency graph
      for (const ref of refs) {
        if (!this.dependencyGraph.has(ref)) {
          this.dependencyGraph.set(ref, []);
        }
        this.dependencyGraph.get(ref).push(path);
      }
    }
  }

  /**
   * Extract references from token value
   */
  extractReferences(value) {
    const refs = [];
    const matches = value.match(/\{([^}]+)\}/g);
    
    if (matches) {
      for (const match of matches) {
        const ref = match.slice(1, -1);
        refs.push(ref);
      }
    }
    
    return refs;
  }

  /**
   * Get category from token path
   */
  getCategoryFromPath(path) {
    const parts = path.split('.');
    if (parts[0] === 'core') return 'core';
    if (parts[0] === 'semantic') return 'semantic';
    if (parts[0] === 'component') return 'component';
    return 'unknown';
  }

  /**
   * Check if a token exists
   */
  hasToken(path) {
    return this.tokens.has(path);
  }

  /**
   * Get a token
   */
  getToken(path) {
    return this.tokens.get(path);
  }

  /**
   * Get all tokens
   */
  getAllTokens() {
    return Array.from(this.tokens.entries());
  }

  /**
   * Check for circular references
   */
  checkCircularReferences() {
    const visited = new Set();
    const recursionStack = new Set();
    const circularRefs = [];

    const dfs = (tokenPath) => {
      if (recursionStack.has(tokenPath)) {
        circularRefs.push(tokenPath);
        return;
      }
      
      if (visited.has(tokenPath)) {
        return;
      }
      
      visited.add(tokenPath);
      recursionStack.add(tokenPath);
      
      const refs = this.references.get(tokenPath) || [];
      for (const ref of refs) {
        dfs(ref);
      }
      
      recursionStack.delete(tokenPath);
    };

    for (const tokenPath of this.tokens.keys()) {
      if (!visited.has(tokenPath)) {
        dfs(tokenPath);
      }
    }

    return circularRefs;
  }
}

// =============================================================================
// ADVANCED VALIDATION RULES
// =============================================================================

class AdvancedValidator {
  constructor() {
    this.rules = new Map();
    this.setupRules();
  }

  /**
   * Setup validation rules
   */
  setupRules() {
    // Token structure validation
    this.rules.set('structure', this.validateStructure.bind(this));
    
    // Reference validation
    this.rules.set('references', this.validateReferences.bind(this));
    
    // Type validation
    this.rules.set('types', this.validateTypes.bind(this));
    
    // Business rules validation
    this.rules.set('business', this.validateBusinessRules.bind(this));
    
    // Performance validation
    this.rules.set('performance', this.validatePerformance.bind(this));
  }

  /**
   * Validate token structure
   */
  validateStructure(token, result) {
    const { path, $value, $type, $description } = token;
    
    // Check required properties
    if (!$value) {
      result.addError(`Missing required $value property`, token.file, path);
    }
    
    if (!$type) {
      result.addError(`Missing required $type property`, token.file, path);
    }
    
    // Check token naming conventions
    if (!this.isValidTokenName(path)) {
      result.addWarning(`Token name doesn't follow naming conventions`, token.file, path);
    }
    
    // Check description
    if (!$description || $description.trim().length === 0) {
      result.addWarning(`Token missing description`, token.file, path);
    }
  }

  /**
   * Validate token references
   */
  validateReferences(token, result, resolver) {
    const { path, $value } = token;
    
    if (typeof $value === 'string' && $value.includes('{')) {
      const refs = resolver.extractReferences($value);
      
      for (const ref of refs) {
        if (!resolver.hasToken(ref)) {
          result.addError(`Broken reference: ${ref}`, token.file, path);
        } else {
          // Check reference type compatibility
          const refToken = resolver.getToken(ref);
          if (!this.isReferenceCompatible(token, refToken)) {
            result.addWarning(`Reference type incompatibility: ${path} -> ${ref}`, token.file, path);
          }
        }
      }
    }
  }

  /**
   * Validate token types
   */
  validateTypes(token, result) {
    const { path, $value, $type } = token;
    
    if (!$type) return;
    
    // Validate specific token types
    switch ($type) {
      case 'color':
        if (!this.isValidColor($value)) {
          result.addError(`Invalid color value: ${$value}`, token.file, path);
        }
        break;
        
      case 'dimension':
        if (!this.isValidDimension($value)) {
          result.addError(`Invalid dimension value: ${$value}`, token.file, path);
        }
        break;
        
      case 'duration':
        if (!this.isValidDuration($value)) {
          result.addError(`Invalid duration value: ${$value}`, token.file, path);
        }
        break;
        
      case 'number':
        if (!this.isValidNumber($value)) {
          result.addError(`Invalid number value: ${$value}`, token.file, path);
        }
        break;
        
      case 'fontFamily':
        if (!this.isValidFontFamily($value)) {
          result.addError(`Invalid font family value: ${$value}`, token.file, path);
        }
        break;
        
      case 'cubicBezier':
        if (!this.isValidCubicBezier($value)) {
          result.addError(`Invalid cubic bezier value: ${$value}`, token.file, path);
        }
        break;
    }
  }

  /**
   * Validate business rules
   */
  validateBusinessRules(token, result) {
    const { path, $value, $type } = token;
    
    // Check for forbidden patterns
    if (typeof $value === 'string') {
      // Check for hardcoded values that should be tokens
      if (this.isHardcodedValue($value) && !$value.includes('{')) {
        result.addWarning(`Possible hardcoded value: ${$value}`, token.file, path);
      }
      
      // Check for deprecated values
      if (this.isDeprecatedValue($value)) {
        result.addError(`Deprecated value: ${$value}`, token.file, path);
      }
    }
    
    // Category-specific rules
    const category = resolver.getCategoryFromPath(path);
    this.validateCategoryRules(token, category, result);
  }

  /**
   * Validate performance considerations
   */
  validatePerformance(token, result) {
    const { path, $value } = token;
    
    // Check for deep reference chains
    if (typeof $value === 'string') {
      const refCount = ($value.match(/\{/g) || []).length;
      if (refCount > 3) {
        result.addWarning(`Deep reference chain (${refCount} references)`, token.file, path);
      }
    }
    
    // Check for complex calculations
    if (this.isComplexCalculation($value)) {
      result.addWarning(`Complex calculation may impact performance`, token.file, path);
    }
  }

  // =============================================================================
  // VALIDATION HELPERS
  // =============================================================================

  isValidTokenName(path) {
    // Check naming conventions (kebab-case, no special chars except dots)
    return /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/.test(path);
  }

  isValidColor(value) {
    if (value.includes('{')) return true; // Reference
    
    const colorRegex = /^(#([0-9a-fA-F]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)|hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;
    return colorRegex.test(value);
  }

  isValidDimension(value) {
    if (value.includes('{')) return true; // Reference
    
    const dimensionRegex = /^(0|(\d+\.?\d*)(px|rem|em|%|vw|vh|vmin|vmax|ch|ex|cap|ic|lh|rlh)|clamp\(\s*[\d.]+(px|rem|em|vw|vh|%)\s*,\s*[\d.]+(px|rem|em|vw|vh|%)\s*,\s*[\d.]+(px|rem|em|vw|vh|%)\s*\)|-?\d+\.?\d*em)$/;
    return dimensionRegex.test(value);
  }

  isValidDuration(value) {
    if (value.includes('{')) return true; // Reference
    
    const durationRegex = /^\d+\.?\d*(s|ms)$/;
    return durationRegex.test(value);
  }

  isValidNumber(value) {
    if (value.includes('{')) return true; // Reference
    
    return !isNaN(parseFloat(value));
  }

  isValidFontFamily(value) {
    if (value.includes('{')) return true; // Reference
    
    // Check for valid font family format
    if (Array.isArray(value)) {
      return value.every(font => typeof font === 'string');
    }
    
    return typeof value === 'string';
  }

  isValidCubicBezier(value) {
    if (value.includes('{')) return true; // Reference
    
    const cubicRegex = /^cubic-bezier\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\)$/;
    return cubicRegex.test(value);
  }

  isReferenceCompatible(token, refToken) {
    // Basic compatibility check - can be enhanced
    if (!token.$type || !refToken.$type) return true;
    
    // Allow certain type conversions
    const compatibleTypes = {
      'color': ['color'],
      'dimension': ['dimension', 'number'],
      'number': ['number', 'dimension'],
      'duration': ['duration', 'number'],
      'fontFamily': ['fontFamily'],
      'fontWeight': ['fontWeight', 'number'],
      'cubicBezier': ['cubicBezier']
    };
    
    return compatibleTypes[token.$type]?.includes(refToken.$type) || false;
  }

  isHardcodedValue(value) {
    // Check for common hardcoded patterns
    const hardcodedPatterns = [
      /^\d+px$/, // Specific pixel values
      /^#[0-9a-fA-F]{6}$/, // Specific hex colors
      /^(rgb|hsl)a?\(/, // Specific color functions
    ];
    
    return hardcodedPatterns.some(pattern => pattern.test(value));
  }

  isDeprecatedValue(value) {
    // Check for deprecated values
    const deprecatedValues = [
      'currentColor', // Use semantic tokens instead
      'inherit', // Use semantic tokens instead
      'initial', // Use semantic tokens instead
    ];
    
    return deprecatedValues.includes(value);
  }

  isComplexCalculation(value) {
    // Check for complex calculations
    return typeof value === 'string' && (
      value.includes('calc(') ||
      value.includes('min(') ||
      value.includes('max(') ||
      value.includes('clamp(')
    );
  }

  validateCategoryRules(token, category, result) {
    // Category-specific validation rules
    switch (category) {
      case 'core':
        this.validateCoreTokens(token, result);
        break;
      case 'semantic':
        this.validateSemanticTokens(token, result);
        break;
      case 'component':
        this.validateComponentTokens(token, result);
        break;
    }
  }

  validateCoreTokens(token, result) {
    // Core tokens should not reference other tokens
    if (typeof token.$value === 'string' && token.$value.includes('{')) {
      result.addWarning(`Core token should not reference other tokens`, token.file, token.path);
    }
  }

  validateSemanticTokens(token, result) {
    // Semantic tokens should reference core or other semantic tokens
    if (typeof token.$value === 'string' && token.$value.includes('{')) {
      const refs = resolver.extractReferences(token.$value);
      for (const ref of refs) {
        if (ref.startsWith('component.')) {
          result.addError(`Semantic token should not reference component token: ${ref}`, token.file, token.path);
        }
      }
    }
  }

  validateComponentTokens(token, result) {
    // Component tokens should reference semantic or core tokens
    if (typeof token.$value === 'string' && token.$value.includes('{')) {
      const refs = resolver.extractReferences(token.$value);
      for (const ref of refs) {
        if (ref.startsWith('component.')) {
          result.addError(`Component token should not reference other component token: ${ref}`, token.file, token.path);
        }
      }
    }
  }
}

// =============================================================================
// MAIN VALIDATION
// =============================================================================

function main() {
  console.log('🔍 Running Advanced Token Validation...');
  
  const result = new ValidationResult();
  const resolver = new TokenResolver();
  const validator = new AdvancedValidator();
  
  try {
    // Load all tokens
    console.log('\n📦 Loading tokens...');
    resolver.loadTokens();
    result.stats.totalTokens = resolver.tokens.size;
    
    // Check for circular references
    console.log('🔄 Checking circular references...');
    const circularRefs = resolver.checkCircularReferences();
    result.stats.circularReferences = circularRefs.length;
    
    for (const ref of circularRefs) {
      result.addError(`Circular reference detected: ${ref}`, '', ref);
    }
    
    // Validate all tokens
    console.log('✅ Validating tokens...');
    for (const [path, token] of resolver.getAllTokens()) {
      let isValid = true;
      
      // Run all validation rules
      for (const [ruleName, rule] of validator.rules) {
        try {
          rule(token, result, resolver);
        } catch (error) {
          result.addError(`Validation rule '${ruleName}' failed: ${error.message}`, token.file, path);
          isValid = false;
        }
      }
      
      if (isValid) {
        result.stats.validTokens++;
      } else {
        result.stats.invalidTokens++;
      }
      
      // Count references
      const refs = resolver.references.get(path) || [];
      result.stats.references += refs.length;
    }
    
    // Check for broken references
    console.log('🔗 Checking references...');
    for (const [path, refs] of resolver.references) {
      for (const ref of refs) {
        if (!resolver.hasToken(ref)) {
          result.stats.brokenReferences++;
        }
      }
    }
    
    // Generate summary
    const summary = result.getSummary();
    
    console.log('\n📊 Validation Summary:');
    console.log(`  - Total Tokens: ${summary.stats.totalTokens}`);
    console.log(`  - Valid Tokens: ${summary.stats.validTokens}`);
    console.log(`  - Invalid Tokens: ${summary.stats.invalidTokens}`);
    console.log(`  - References: ${summary.stats.references}`);
    console.log(`  - Broken References: ${summary.stats.brokenReferences}`);
    console.log(`  - Circular References: ${summary.stats.circularReferences}`);
    console.log(`  - Errors: ${summary.errors}`);
    console.log(`  - Warnings: ${summary.warnings}`);
    console.log(`  - Info: ${summary.info}`);
    
    // Show detailed results if there are issues
    if (result.hasErrors() || result.hasWarnings()) {
      console.log('\n🔍 Detailed Issues:');
      
      if (result.hasErrors()) {
        console.log('\n❌ Errors:');
        result.errors.forEach(error => {
          console.log(`  ${error.file ? `${error.file}:` : ''}${error.token ? `${error.token}:` : ''} ${error.message}`);
        });
      }
      
      if (result.hasWarnings()) {
        console.log('\n⚠️  Warnings:');
        result.warnings.forEach(warning => {
          console.log(`  ${warning.file ? `${warning.file}:` : ''}${warning.token ? `${warning.token}:` : ''} ${warning.message}`);
        });
      }
    }
    
    // Exit with appropriate code
    if (result.hasErrors()) {
      console.error('\n❌ Advanced validation failed!');
      process.exit(1);
    } else {
      console.log('\n✅ All tokens passed advanced validation!');
      
      if (result.hasWarnings()) {
        console.log('⚠️  Some warnings were found - review recommended');
      }
    }
    
  } catch (error) {
    console.error(`❌ Advanced validation failed: ${error.message}`);
    process.exit(1);
  }
}

// Global resolver instance for validation rules
let resolver;

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
