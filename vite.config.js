import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/recetas-react-vite-rest-graphql/' : '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    css: true,
    include: ['tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [
      'node_modules/**',
      'backup/**',
      'dist/**',
      'src/**/__tests__/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'node_modules/',
        'backup/',
        'src/test/',
        'src/mocks/',
        'src/data/',
        '**/*.config.js',
        '**/main.jsx',
        '**/*.json',
      ],
      thresholds: {
        statements: 45,
        functions: 45,
        lines: 45,
      }
    },
  },
}))
