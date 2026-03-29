import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tokens: 'src/tokens/index.ts',
    themes: 'src/themes/index.ts',
    schema: 'src/schema/index.ts',
    'css/generator': 'src/utils/css-generator.ts',
    css: 'src/css.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  external: ['zod'],
  minify: false,
});
