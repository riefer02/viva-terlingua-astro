// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify({
    imageCDN: true, // Enable Netlify's image CDN
    cacheOnDemandPages: true, // Enable caching for better performance
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
