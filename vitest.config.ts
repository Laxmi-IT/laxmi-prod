import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['__tests__/setup.ts'],
    include: ['__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/**',
        'src/i18n/dictionaries.ts',
        'src/middleware.ts',
        'src/app/api/**/route.ts',
      ],
      exclude: [
        'src/lib/admin/**',
        'src/lib/gemini/**',
        'src/lib/postgrid/**',
        'src/lib/image/**',
        'src/lib/supabase/**',
        'src/lib/blog/data.ts',
        'src/lib/blog/types.ts',
        'src/lib/gallery/types.ts',
        'src/app/api/admin/**',
        'src/app/api/gemini/**',
        'src/app/api/notifications/**',
      ],
      thresholds: {
        statements: 60,
        functions: 60,
        branches: 50,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
