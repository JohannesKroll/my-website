import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('content, links, local assets and game code loaded only on demand', async ({ page }) => {
  const failures: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(message.text());
  });
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Johannes');
  await expect(page.getByRole('link', { name: 'Let’s talk', exact: true }).last()).toHaveAttribute(
    'href',
    'mailto:mail@johanneskroll.com',
  );
  for (const image of await page.locator('img').all()) await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator('img')
        .evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)),
    )
    .toBeTruthy();
  expect(requests.every((url) => url.startsWith('http://127.0.0.1:4321'))).toBeTruthy();
  expect(requests.some((url) => /\/games\./.test(url))).toBeFalsy();
  await page.getByRole('button', { name: 'Let’s play' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(requests.some((url) => /\/games\./.test(url))).toBeTruthy();
  expect(failures).toEqual([]);
});

test('navigation works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole('heading', { name: 'Knapp Malerei' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Let’s play' })).toBeHidden();
  await expect(page.getByText('The games need JavaScript.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'mail@johanneskroll.com' })).toHaveAttribute(
    'href',
    'mailto:mail@johanneskroll.com',
  );
  await context.close();
});

test('memory can be completed and reset; mismatched cards turn back over', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Let’s play' }).click();
  const cards = page.locator('.memory-card');
  await expect(cards).toHaveCount(8);
  const names: string[] = [];
  for (let index = 0; index < 8; index += 2) {
    await cards.nth(index).click();
    names[index] = (await cards.nth(index).getAttribute('aria-label'))!.split(', ')[1];
    await cards.nth(index + 1).click();
    names[index + 1] = (await cards.nth(index + 1).getAttribute('aria-label'))!.split(', ')[1];
    if (names[index] !== names[index + 1]) {
      await expect(cards.nth(index)).toHaveText('?');
      await expect(cards.nth(index + 1)).toHaveText('?');
    }
  }
  for (const name of new Set(names)) {
    const pair = names.flatMap((n, i) => (n === name ? [i] : []));
    if (!(await cards.nth(pair[0]).getAttribute('aria-disabled'))) {
      await cards.nth(pair[0]).click();
      await cards.nth(pair[1]).click();
    }
  }
  await expect(page.locator('#game-status')).toContainText('All four pairs');
  await expect(page.locator('.matched')).toHaveCount(8);
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.locator('#game-counter')).toHaveText('0 MOVES · 0/4 PAIRS');
  await expect(page.locator('.matched')).toHaveCount(0);
  await expect(cards.nth(0)).toHaveAttribute('aria-label', 'Card 1, face down');
});

test('connection puzzle detects a solution, invalid groups and resets', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Connect the dots' }).click();
  for (const dot of ['A', 'B', 'C', 'D'])
    await page.getByRole('button', { name: new RegExp(`^Dot ${dot},`) }).click();
  await expect(page.locator('#game-status')).toContainText('You found the clique!');
  await expect(page.locator('.selected-edge')).toHaveCount(6);
  await page.getByRole('button', { name: /^Dot F,/ }).click();
  await expect(page.locator('#game-status')).toContainText('Not everyone');
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.locator('#game-counter')).toHaveText('0/4 DOTS SELECTED');
  await expect(page.locator('.graph-node[aria-pressed="true"]')).toHaveCount(0);
});

test('dialog keyboard focus, Escape, and repeated game changes', async ({ page }) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Let’s play' });
  await opener.click();
  await expect(page.getByRole('button', { name: 'Close game' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Start again' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await page.locator('.memory-card').nth(0).click();
  await page.locator('.memory-card').nth(1).click();
  await page.getByRole('button', { name: 'Close game' }).click();
  await page.getByRole('button', { name: 'Connect the dots' }).click();
  await expect(
    page.getByRole('heading', { name: 'Find the clique', exact: true, level: 2 }),
  ).toBeVisible();
  await expect(page.locator('.graph-node')).toHaveCount(6);
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(page.locator('.memory-card')).toHaveCount(0);
});

test('hidden surprises and clipboard fallback', async ({ page }) => {
  await page.goto('/');
  const smiley = page.locator('#smiley');
  for (let i = 0; i < 3; i++) await smiley.click();
  await expect(page.locator('#toast')).toContainText('Secret found');
  for (const key of [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ])
    await page.keyboard.press(key);
  await expect(page.locator('html')).toHaveClass('retro-mode');
  for (const key of [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ])
    await page.keyboard.press(key);
  await expect(page.locator('html')).not.toHaveClass('retro-mode');
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('unavailable')) },
      configurable: true,
    }),
  );
  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.locator('#toast')).toHaveText('You can email me at mail@johanneskroll.com.');
});

test('email copy success', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: (text: string) => {
          (window as unknown as { copied: string }).copied = text;
          return Promise.resolve();
        },
      },
      configurable: true,
    }),
  );
  await page.getByRole('button', { name: 'Copy email' }).click();
  await expect(page.locator('#toast')).toContainText('Email copied');
  expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toBe(
    'mail@johanneskroll.com',
  );
});

test('no horizontal overflow, even on narrow screens', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `page width ${width}`,
    ).toBeTruthy();
  }
});

test('accessible page and games', async ({ page }) => {
  await page.goto('/');
  const scan = () =>
    new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect((await scan()).violations).toEqual([]);
  for (const name of ['Let’s play', 'Connect the dots']) {
    await page.getByRole('button', { name }).click();
    expect((await scan()).violations).toEqual([]);
    await page.getByRole('button', { name: 'Close game' }).click();
  }
});

test('support pages and custom 404', async ({ page }) => {
  for (const [path, title] of [
    ['/privacy/', 'Privacy.'],
    ['/site-info/', 'The details.'],
    ['/404.html', 'Curiosity brought'],
  ]) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title);
  }
});

test('reduced motion preference is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
});
