import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'primitives': 'src/primitives/index.ts',
    'components': 'src/components/index.ts',
    'hooks': 'src/hooks/index.ts',
    'providers': 'src/providers/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  outExtension: ({ format }) => {
    return {
      '.js': format === 'cjs' ? '.cjs' : '.js'
    };
  },
  external: [
    'react',
    'react-dom',
    '@repo/design-tokens',
    '@repo/contracts',
    '@repo/ui/internal'
  ],
  esbuildOptions: (options) => {
    options.banner = {
      js: '"use client";'
    };
  },
  onSuccess: async () => {
    console.log('✅ @repo/ui build completed successfully');
  }
});
