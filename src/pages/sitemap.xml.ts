import type { APIRoute } from 'astro';
import { indexablePaths } from '../data/seo';

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('Set site in astro.config.mjs before building.');
  const entries = indexablePaths
    .map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`)
    .join('\n  ');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${entries}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
