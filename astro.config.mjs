// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';
import { redirects } from './src/config/redirects';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://abowlofred.com', // Production site URL
  output: 'static',
  adapter: netlify({
    imageCDN: true, // Enable Netlify's image CDN
    cacheOnDemandPages: true, // Enable caching for better performance
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), sitemap()],
  redirects,
});
