import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'hybrid', // Híbrido: SSG por defecto, SSR para páginas específicas
  adapter: vercel(),
  site: 'https://paraisociclista.com',
});
