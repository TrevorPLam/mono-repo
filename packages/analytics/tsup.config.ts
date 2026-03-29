import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'providers/index': 'src/providers/index.ts',
    'consent/index': 'src/consent/index.ts',
    'events/index': 'src/events/index.ts',
    'adapters/index': 'src/adapters/index.ts'
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['@repo/contracts', '@repo/env']
})
