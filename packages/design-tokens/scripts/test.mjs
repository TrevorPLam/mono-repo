#!/usr/bin/env node

console.log('🎨 Starting CSS generation...');

import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Use current working directory
const ROOT_DIR = process.cwd();
const OUTPUT_DIR = join(ROOT_DIR, 'src', 'generated');

console.log('📁 Root directory:', ROOT_DIR);
console.log('📁 Output directory:', OUTPUT_DIR);

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  console.log('📁 Creating output directory...');
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Test reading a token file
const colorFile = join(ROOT_DIR, 'tokens', 'core', 'color.json');
console.log('📄 Reading color file:', colorFile);
console.log('📄 File exists:', existsSync(colorFile));

if (existsSync(colorFile)) {
  try {
    const data = readFileSync(colorFile, 'utf8');
    console.log('📄 File content length:', data.length);
    
    // Write a simple CSS file
    const css = `/* Test CSS */
:root {
  --test-color: #3b82f6;
}
`;
    
    const testFile = join(OUTPUT_DIR, 'test.css');
    writeFileSync(testFile, css);
    console.log('✅ Test CSS written to:', testFile);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

console.log('✅ Script completed');
