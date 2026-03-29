import StyleDictionary from 'style-dictionary';

// =============================================================================
// CONFIGURATION
// =============================================================================

const config = {
  // Source token files
  source: [
    'tokens/core/**/*.json',
    'tokens/semantic/**/*.json',
    'tokens/component/**/*.json',
    'tokens/themes/**/*.json'
  ],

  // Platform outputs
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
          transformGroup: ['size/css', 'color/css'],
          options: {
            showFileHeader: true,
            outputReferences: false,
            naming: {
              prefix: 'tw'
            }
          }
        }
      ]
    }
  }
};

// =============================================================================
// CUSTOM TRANSFORMS
// =============================================================================

// Transform for naming CSS variables
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
// EXPORT
// =============================================================================

export default config;
