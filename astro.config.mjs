import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://savitsky.netlify.app',
  integrations: [sitemap()],
  publicDir: 'public',
});
