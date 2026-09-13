import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.johanneskroll.com',
  output: 'static',
  trailingSlash: 'always',
  vite: { build: { assetsInlineLimit: 0 } },
});
