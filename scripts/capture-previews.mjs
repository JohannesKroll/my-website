import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

// Start `npm run preview -- --port 4321` before running this script.
const origin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4321';
const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {}),
});

try {
  await mkdir('docs/previews', { recursive: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = [...document.images];
    images.forEach((image) => {
      image.loading = 'eager';
    });
    await Promise.all(images.map((image) => image.decode()));
  });
  await page.screenshot({ path: 'docs/previews/desktop.png', fullPage: true });
  await page.screenshot({ path: 'docs/previews/hero.png' });
  await page
    .locator('#about')
    .screenshot({ path: 'docs/previews/about.png', style: '.skip-link { visibility: hidden; }' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'docs/previews/mobile.png', fullPage: true });
  await page.screenshot({ path: 'docs/previews/mobile-hero.png' });
  await page.locator('#about').screenshot({
    path: 'docs/previews/about-mobile.png',
    style: '.skip-link { visibility: hidden; }',
  });
  await page.getByRole('button', { name: 'Connect the dots' }).click();
  await page.screenshot({ path: 'docs/previews/game.png' });
  await page.getByRole('button', { name: 'Close game' }).click();
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'docs/previews/tablet.png' });

  await page.setViewportSize({ width: 1200, height: 630 });
  await page.evaluate(() => {
    // Trusted local markup. The sharing graphic deliberately contains no portrait.
    document.body.innerHTML = `<main style="width:1200px;height:630px;padding:48px 65px;background:var(--paper);overflow:hidden;position:relative">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--ink);padding-bottom:22px;font-family:var(--mono);font-size:16px"><span>JK <span style="color:var(--accent)">/</span></span><span>johanneskroll.com</span></div>
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:70px;align-items:center;padding-top:58px"><h1 style="font-size:153px;letter-spacing:-.075em;line-height:.95">Johannes<br><span style="color:var(--accent)">Kroll.</span></h1><div><p style="font-family:var(--mono);font-size:12px;letter-spacing:1px;color:var(--accent);margin:0 0 25px">AI & DATA SCIENTIST</p><p style="font-size:31px;letter-spacing:-.7px;line-height:1.4">AI agents, the data behind them, and software people use.</p><p style="font-size:17px;color:var(--muted);margin:23px 0 0;line-height:1.6">Websites. Custom software.<br>Agentic AI & evaluation.</p></div></div>
      <div style="position:absolute;bottom:35px;left:65px;right:65px;border-top:1px solid var(--line);padding-top:16px;font-family:var(--mono);font-size:11px;color:var(--muted)">Software, AI & a few other things</div></main>`;
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: 'public/images/social.png' });
  console.log(
    'Updated desktop, phone, tablet, About, game and social previews. Rebuild to copy the social image to dist.',
  );
} finally {
  await browser.close();
}
