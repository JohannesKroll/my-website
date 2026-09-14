# Search and mobile handoff

## Implemented

- Descriptive homepage title and summary focused on Johannes Kroll, AI and data science, agent evaluation, web development, and custom software.
- One main heading, clear project/service descriptions, semantic navigation, real links, and all core text in the generated HTML.
- Identical core content on mobile and desktop, using a responsive layout rather than a separate mobile site.
- Linked `WebSite`, `ProfilePage`, and `Person` JSON-LD on the homepage. It reflects the visible SAP role, interests, education and supplied profile links. No portrait, fabricated address, review rating, or unsupported business claims are included.
- Canonical URLs, Open Graph metadata, a text-only 1200×630 sharing image, and a large-card Twitter/X preview.
- Generated XML sitemap and crawler access via `robots.txt`. The incomplete site-info page and custom 404 are marked `noindex`; neither appears in the sitemap.
- Responsive, lazy-loaded client imagery with explicit dimensions; one local font; game JavaScript fetched only when needed.
- Mobile contact navigation, larger reading text, primary controls with at least 44px height, and game dialogs that scroll on short screens.

## After publishing

1. Make `https://www.johanneskroll.com/` the primary Firebase Hosting domain and redirect `johanneskroll.com` to it. Follow Firebase’s domain-specific DNS instructions.
2. Check that HTTPS works and the homepage, assets, `/robots.txt`, and `/sitemap.xml` return successfully. Unknown URLs should return a real HTTP 404.
3. Verify the domain in [Google Search Console](https://search.google.com/search-console/about), then submit `https://www.johanneskroll.com/sitemap.xml`.
4. Inspect the homepage URL with Search Console’s live test. Confirm Google can retrieve the rendered content and recognizes the intended canonical URL. Request indexing after the public version is ready.
5. Check the published URL in [Google’s Rich Results Test](https://search.google.com/test/rich-results) for structured-data validation. This site’s local checks verify the JSON and its consistency; Google’s live validation has not been run on an unpublished domain.
6. Run a fresh mobile performance audit against the deployed HTTPS site. Local Lighthouse scores are lab measurements, not field performance or search rankings.

No Search Console account, DNS record, indexing request, or deployment was changed during development. Keep role descriptions, projects and contact details up to date. When adding a new indexable page, add its path to `src/data/seo.ts`.

## References

The implementation follows Google’s [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [mobile-first indexing guidance](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing), and [ProfilePage structured-data documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page). Technical SEO helps search engines understand a site; it does not guarantee indexing, rich results, or a particular ranking.
