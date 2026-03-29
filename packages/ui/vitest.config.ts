import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup/vitest.setup.ts'],
    include: ['test/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', 'stories'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'stories/',
        'test/',
        '**/*.stories.tsx',
        '**/*.config.*',
        '**/index.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@test-utils': resolve(__dirname, './src/test-utils')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  optimizeDeps: {
    exclude: ['@repo/design-tokens']
  }
});
