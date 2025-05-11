// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';
import { redirects } from './src/config/redirects';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://abowlofred.com',
  output: 'static',
  adapter: netlify({
    imageCDN: true,
    cacheOnDemandPages: true,
  }),
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'exclude-test-files',
        resolveId(id) {
          // Prevent test files from being processed during development
          if (
            id.includes('__tests__') ||
            id.endsWith('.test.ts') ||
            id.endsWith('.test.tsx')
          ) {
            return { id, external: true };
          }
          return null;
        },
      },
    ],
  },
  integrations: [
    react(),
    sitemap(),
    partytown({
      config: {
        debug: import.meta.env.DEV,
        forward: ['dataLayer.push'],
      },
    }),
  ],
  redirects,
});
