// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';
import { redirects } from './src/config/redirects';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://abowlofred.com',
  output: 'static',
  adapter: netlify({
    imageCDN: true,
    cacheOnDemandPages: true,
  }),
  vite: {
    plugins: [tailwindcss()],
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
