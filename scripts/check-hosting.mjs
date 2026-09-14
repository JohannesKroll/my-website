import assert from 'node:assert/strict';

const origin = 'http://127.0.0.1:5000';
const home = await fetch(origin);
assert.equal(home.status, 200);
const html = await home.text();
assert.match(html, /AI &amp; Data Scientist/);
assert.match(html, /https:\/\/www\.johanneskroll\.com\//);
assert.match(home.headers.get('cache-control'), /max-age=0/);
assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
assert.equal(home.headers.get('x-frame-options'), 'DENY');
assert.equal(home.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');

const cssPath = html.match(/href="(\/_astro\/[^\"]+\.css)"/)?.[1];
assert.ok(cssPath, 'The generated HTML should link to its stylesheet.');
const css = await fetch(origin + cssPath);
assert.equal(css.status, 200);
assert.match(css.headers.get('cache-control'), /max-age=31536000,immutable/);

for (const path of ['/privacy/', '/site-info/']) {
  const page = await fetch(origin + path);
  assert.equal(page.status, 200, path);
  assert.match(page.headers.get('cache-control'), /max-age=0/);
  const redirect = await fetch(origin + path.slice(0, -1), { redirect: 'manual' });
  assert.equal(redirect.status, 301, path);
  assert.equal(redirect.headers.get('location'), path);
}

const missing = await fetch(origin + '/not-a-page/');
assert.equal(missing.status, 404);
assert.match(await missing.text(), /Curiosity brought/);
assert.equal((await fetch(origin + '/images/johannes.webp')).status, 404);

const sitemap = await fetch(origin + '/sitemap.xml');
assert.equal(sitemap.status, 200);
assert.match(sitemap.headers.get('cache-control'), /max-age=3600/);
assert.match(await sitemap.text(), /<loc>https:\/\/www\.johanneskroll\.com\/<\/loc>/);
const robots = await fetch(origin + '/robots.txt');
assert.equal(robots.status, 200);
assert.match(robots.headers.get('cache-control'), /max-age=3600/);
assert.match(await robots.text(), /Sitemap: https:\/\/www\.johanneskroll\.com\/sitemap\.xml/);

const social = await fetch(origin + '/images/social.png');
assert.equal(social.status, 200);
assert.match(social.headers.get('cache-control'), /max-age=86400/);

console.log(
  'Firebase Hosting emulator: pages, redirects, real 404s, security headers, assets, sitemap and caching passed.',
);
