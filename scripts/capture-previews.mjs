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
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'docs/previews/mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Connect the dots' }).click();
  await page.screenshot({ path: 'docs/previews/game.png' });
  await page.getByRole('button', { name: 'Close game' }).click();

  await page.setViewportSize({ width: 1200, height: 630 });
  await page.evaluate(() => {
    // All content is trusted local presentation markup, not user input.
    const illustration = document.querySelector('.hero-art').outerHTML;
    document.body.innerHTML = `<main style="width:1200px;height:630px;padding:55px 70px;background:#f7f7ef;overflow:hidden;position:relative">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d7dacd;padding-bottom:22px"><span style="font-family:var(--display);font-size:30px;letter-spacing:-1.2px">Johannes Kroll<span style="color:#74972f">.</span></span><span style="font-size:15px;color:#65695d">johanneskroll.com</span></div>
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:35px;align-items:center;padding-top:26px"><div><p style="font-family:var(--display);font-size:11px;letter-spacing:2px;color:#65695d;margin:0 0 20px">DEVELOPER & CURIOUS HUMAN</p><h1 style="font-size:77px;letter-spacing:-4px;line-height:1.06">A curious mind.<br>A hands-on<br><span class="serif-word">builder.</span></h1><p style="font-size:17px;color:#65695d;margin:24px 0 0">Websites. Useful software. Practical AI.</p></div><div style="height:425px;position:relative">${illustration}</div></div></main>`;
    const art = document.querySelector('.hero-art');
    art.style.cssText =
      'width:460px;height:455px;transform:scale(.9);transform-origin:left top;margin:0;position:absolute;top:-5px;left:-8px';
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: 'public/images/social.png' });
  console.log(
    'Saved desktop, mobile, game and social previews. Rebuild to copy the social image to dist.',
  );
} finally {
  await browser.close();
}
