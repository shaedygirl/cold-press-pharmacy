import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx,js,jsx}'],
    globals: true,
    coverage: { reporter: ['text', 'html'] },
    setupFiles: ['tests/setup/env.ts'],
  },
})