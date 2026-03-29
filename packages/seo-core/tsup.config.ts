import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'policy/index': 'src/policy/index.ts',
    'metadata/index': 'src/metadata/index.ts',
    'canonicals/index': 'src/canonicals/index.ts',
    'sitemap/index': 'src/sitemap/index.ts',
    'robots/index': 'src/robots/index.ts',
    'schema/index': 'src/schema/index.ts',
    'config/index': 'src/config/index.ts',
    'routing/index': 'src/routing/index.ts',
    'resolution/index': 'src/resolution/index.ts'
  },
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ['@repo/contracts'],
  splitting: false,
  minify: false,
  bundle: false
})
