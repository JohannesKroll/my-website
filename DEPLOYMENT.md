# Firebase Hosting

This project is configured for **`personal-website-472f2`**, using the same deployment workflow as `../no-bull-shit`: a pinned Firebase CLI, an automatic production build before publishing, and local Hosting emulator checks.

Verified on 14 September 2026: Firebase confirms `personal-website-472f2` is the project's default Hosting site. The production build, Hosting emulator checks, and formatting checks passed. No deployment was performed.

## Sign in

Use Node.js 24 LTS (`nvm use`), then run:

```sh
npm ci
npm run firebase:login
```

If the CLI reports an expired login, use `npm run firebase:login -- --reauth`. Sign in with an account that can deploy to `personal-website-472f2`.

## Deploy

```sh
npm run deploy
```

The command explicitly selects `personal-website-472f2` and publishes **Hosting only**. The `predeploy` hook runs `npm run build`, including Astro’s type checks, so the files in `dist/` are rebuilt before upload. A failed build stops deployment.

Both `.firebaserc` and `firebase.json` are provided; there is no need to run `firebase init` or overwrite the existing configuration. The configured Hosting site is `personal-website-472f2`. If Hosting has not been enabled, complete **Get started** in the [project’s Hosting console](https://console.firebase.google.com/project/personal-website-472f2/hosting).

The configured site’s Firebase URL is:

```text
https://personal-website-472f2.web.app
```

This setup does not publish the site or change any DNS records. Run the deploy command when you are ready, after completing the remaining content in [launch notes](docs/LAUNCH.md).

## Custom domain

Add `www.johanneskroll.com` in Firebase Hosting and enter the exact DNS records shown by Firebase at your domain provider. Add `johanneskroll.com` as a redirect to the `www` address. The site’s canonical URLs and sitemap already use `https://www.johanneskroll.com/`.

Follow the existing [SEO launch steps](docs/SEO.md) once the custom domain is live.

## Local Hosting check

```sh
npm run hosting:check
```

This builds the site and starts only the Hosting emulator on port **5000**, with a **demo project ID**. It then checks real pages, trailing-slash redirects, the custom HTTP 404, security headers, cache policies, the sitemap, robots file and social image. The emulator shuts down when the checks finish. This command does not deploy or write to your production project. Stop another local server on port 5000 before running it.

## Configuration

- `.firebaserc`: default Firebase project `personal-website-472f2`.
- `firebase.json`: explicit Hosting site, static `dist/` directory, predeploy build hook, headers, and emulator settings.
- `package.json`: `firebase:login`, `hosting:check` and `deploy` scripts, using **`firebase-tools@15.30.0`**, matching the neighboring project.
- `scripts/check-hosting.mjs`: assertions against the local Hosting emulator.

HTML revalidates on each request. Fingerprinted Astro assets cache for one year, the sharing image for one day, and the sitemap and robots file for one hour. There is no catch-all rewrite; unknown paths return HTTP 404. This static site does not need a Firebase browser SDK, Analytics, Firestore, or Cloud Functions.
