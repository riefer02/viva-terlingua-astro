/// <reference types="vitest" />
/// <reference types="vite/client" />
import { getViteConfig } from 'astro/config';
import path from 'path';

/**
 * Vitest configuration for testing
 *
 * - We use happy-dom as the default environment for component tests
 * - For API tests, you can specify node environment with the directive:
 *   // @vitest-environment node
 *
 * - Make sure to match the environment to the test type:
 *   - Use happy-dom for React components
 *   - Use node for API endpoints and utilities
 */
export default getViteConfig({
  test: {
    globals: true,
    environment: 'happy-dom', // Default environment for component tests
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tests': path.resolve(__dirname, './src/__tests__'),
      },
    },
  },
  // If we needed to pass Astro-specific config for tests, it would be a second argument here.
  // For now, loading the default astro.config.mjs should be sufficient.
});
