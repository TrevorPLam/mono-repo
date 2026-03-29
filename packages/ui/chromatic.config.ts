// Chromatic configuration for @repo/ui package
// See: https://www.chromatic.com/docs/cli

const config = {
  // Build configuration
  buildScript: 'build-storybook',
  
  // Testing configuration
  exitZeroOnChanges: false,
  autoAcceptChanges: false,
  
  // Performance optimization with TurboSnap
  turboSnap: {
    onlyStoryFiles: true,
    packageManager: 'pnpm',
  },
  
  // Viewport configuration for responsive testing
  viewports: {
    mobile: { width: 320, height: 568 },     // iPhone SE
    mobileLandscape: { width: 568, height: 320 },
    tablet: { width: 768, height: 1024 },     // iPad
    tabletLandscape: { width: 1024, height: 768 },
    desktop: { width: 1024, height: 768 },    // Desktop
    wide: { width: 1440, height: 900 },      // Wide desktop
    ultrawide: { width: 1920, height: 1080 }, // Full HD
  },
  
  // Storybook server configuration
  port: 6006,
  host: 'localhost',
  
  // Archive configuration
  archiveLocation: './storybook-static',
  
  // CI-specific configuration
  ci: {
    // Run in headless mode in CI
    headless: true,
    
    // Configure for CI environment
    skipInstall: false,
    
    // Enable verbose logging for debugging
    verbose: true,
    
    // Enable parallel builds for faster CI
    parallel: true,
    
    // Configure retries for flaky tests
    retries: 2,
  },
  
  // Ignore patterns (if needed)
  ignore: [
    '**/*.stories.mdx', // Ignore MDX stories if any
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
  ],
  
  // Script configuration
  script: {
    // Custom build command if needed
    build: 'pnpm run build-storybook',
    
    // Custom serve command if needed
    serve: 'pnpm run storybook',
  },
  
  // Advanced configuration
  addons: [
    {
      name: '@chromatic-com/storybook',
      options: {
        // Enable visual testing for all stories
        enableVisualTesting: true,
        
        // Configure snapshot behavior
        snapshot: {
          // Capture full page snapshots
          fullPage: true,
          
          // Wait for animations to complete
          waitAnimations: true,
          
          // Wait for network idle
          waitNetworkIdle: true,
          
          // Custom delay for complex animations
          delay: 100,
        },
        
        // Configure diff behavior
        diff: {
          // Threshold for pixel differences (0-1)
          threshold: 0.01,
          
          // Enable advanced diffing
          enableAdvancedDiffing: true,
          
          // Ignore specific regions if needed
          ignoreRegions: [],
        },
        
        // Configure UI testing
        ui: {
          // Enable UI testing
          enableUITesting: true,
          
          // Configure viewport testing
          viewports: ['mobile', 'tablet', 'desktop', 'wide'],
          
          // Configure theme testing
          themes: ['light', 'dark'],
        },
      },
    },
  ],
  
  // Environment configuration
  env: {
    // Set environment variables for testing
    NODE_ENV: 'test',
    STORYBOOK_ENV: 'test',
  },
  
  // Performance monitoring
  performance: {
    // Enable performance monitoring
    enabled: true,
    
    // Configure performance budgets
    budgets: {
      // Maximum bundle size in KB
      bundleSize: 500,
      
      // Maximum build time in seconds
      buildTime: 120,
    },
  },
  
  // Accessibility integration
  accessibility: {
    // Enable accessibility testing
    enabled: true,
    
    // Configure accessibility rules
    rules: [
      'color-contrast',
      'keyboard-navigation',
      'screen-reader-support',
      'focus-management',
    ],
    
    // Configure accessibility reporting
    reporting: {
      // Generate accessibility reports
      generateReports: true,
      
      // Include accessibility in build status
      failOnViolations: false, // Don't fail builds, just report
    },
  },
  
  // Integration with other tools
  integrations: {
    // Enable GitHub integration
    github: {
      // Post comments on PRs
      postComments: true,
      
      // Add status checks
      addStatusChecks: true,
      
      // Configure PR behavior
      requireReview: false,
    },
  },
  
  // Advanced testing configuration
  testing: {
    // Configure test runner
    runner: {
      // Enable test runner
      enabled: true,
      
      // Configure test timeout
      timeout: 10000,
      
      // Configure retry strategy
      retry: {
        attempts: 3,
        delay: 1000,
      },
    },
    
    // Configure visual regression testing
    visualRegression: {
      // Enable visual regression testing
      enabled: true,
      
      // Configure regression detection
      regressionThreshold: 0.01,
      
      // Configure baseline management
      baselineManagement: 'auto',
    },
  },
};

export default config;
