# Johannes Kroll

A small, playful personal and freelance website for **www.johanneskroll.com**.

## Run it

Use Node.js 24 LTS (`nvm use` if you use nvm), then:

```sh
npm ci
npm run dev
```

Open **http://localhost:4321**. For a production build:

```sh
npm run build
npm run preview
```

The complete deployable site is in `dist/`.

## Why this stack

- **Astro, static output:** pages are rendered at build time. Good for a small content-led site that should load quickly, be indexable, and need very little maintenance. [Astro’s architecture](https://docs.astro.build/en/concepts/why-astro/).
- **Plain CSS and TypeScript:** no React runtime, UI framework, animation library, backend, or database. Most of the page is ordinary HTML. A small script enables the copy button, Easter eggs, and game launcher; the game module is loaded only on demand.
- **Locally served variable fonts and WebP images:** no third-party font requests or embeds. The hero and project illustrations are CSS/SVG.
- **Firebase Hosting:** serves the generated files directly. No Firebase SDK or paid application backend is needed for these features. [Hosting configuration](https://firebase.google.com/docs/hosting/full-config).

The games use only in-memory state. There are no analytics, cookies, persistent browser storage, external live API requests, or submitted forms. Contact uses an ordinary email link.

## Editing

| File                                                   | Contents                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `src/pages/index.astro`                                | Main page copy, services, projects, about, contact                     |
| `src/layouts/Layout.astro`                             | Navigation, footer, SEO and social metadata                            |
| `src/styles/global.css`                                | Colours, typography, layout, responsive and game styles                |
| `src/styles/fonts.css`                                 | Local Latin variable font files                                        |
| `src/components/Playground.astro`                      | Playground and game dialog                                             |
| `src/scripts/main.ts`                                  | Progressive enhancement, contact, secrets, modal lifecycle             |
| `src/scripts/games.ts`                                 | Memory and graph games, loaded when first opened                       |
| `public/images/`                                       | Portrait, client screenshot, social preview                            |
| `src/pages/site-info.astro`, `src/pages/privacy.astro` | Contact and privacy pages; complete business details before publishing |
| `firebase.json`                                        | Static hosting configuration, cache and security headers               |

Content starts in English. The CV supports German and English contact. Johannes’s direct updates provide the current SAP role since April 2025, open-source enthusiasm, and volunteering with SV 1880 München and Münchner Sportjugend. No current location, availability, or client performance metrics have been inferred from the old CV. See [content sources and launch details](docs/LAUNCH.md).

## Firebase deployment

Deployment is left to you. No Firebase project has been created or connected, and nothing has been published.

After completing the items in `docs/LAUNCH.md`:

```sh
npm run build
npx firebase-tools login
npx firebase-tools deploy --only hosting --project YOUR_FIREBASE_PROJECT_ID
```

If you prefer to run `firebase init hosting`, keep `dist` as the public directory, choose **No** for single-page app rewrites, and preserve the provided `firebase.json`. Astro generates a real `404.html` and separate pages; requests should not all be rewritten to the homepage.

In Firebase Hosting, attach **www.johanneskroll.com** and set up **johanneskroll.com** to redirect to it, following the DNS values Firebase gives you. The `www` address is the canonical URL in metadata, `robots.txt`, and `sitemap.xml`. No DNS records or certificates have been changed here.

## Checks

```sh
npm run build
npx playwright install chromium
npm test
npm run format:check
```

`npm test` starts a production preview and checks desktop/mobile layouts, both game outcomes and resets, dialog keyboard focus, no-JavaScript navigation, clipboard success/fallback, Easter eggs, reduced motion, lazy game loading, local asset requests, and automated WCAG A/AA accessibility checks. Build first after making changes. Automated accessibility checks are useful coverage, not a guarantee of complete accessibility.

To use an installed Chromium instead of downloading Playwright’s copy:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm test
```

## The secrets (spoilers)

- Say hello to the hero smiley three times.
- Type **↑ ↑ ↓ ↓ ← → ← → B A** outside a game to toggle the retro palette. Repeat to switch back.
- Play memory with touch, a mouse, or Tab and Enter. Match all four pairs.
- In the connection puzzle, **A, B, C, D** form the four-node clique. Every node announces its neighbours for screen-reader play.

No timer, sound, flashing effects, or forced animations. Reduced-motion preferences are respected.

## Design previews

Saved screenshots are in `docs/previews/`: `hero.png`, `desktop.png`, `mobile.png`, and `game.png`. To refresh them and regenerate the social image, run `node scripts/capture-previews.mjs` with the production preview running on port 4321, then rebuild. The same `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` override is supported.
