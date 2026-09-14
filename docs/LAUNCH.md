# Content and launch details

## Confirm before publishing

1. **Public business/provider information.** Fill in your current public business name, service address and any applicable registration/tax information in `src/pages/site-info.astro`. The old CV’s home address, date of birth and phone numbers were deliberately not copied to the website. The existing contact-only page is not a completed legal imprint.
2. **Privacy notice.** `src/pages/privacy.astro` accurately describes the application’s behaviour but is a starting point, not a complete jurisdiction-specific notice. Complete it with your current controller details, the final hosting arrangement and retention/contact practices before launch.
3. **Current positioning.** The site describes freelance websites, custom software and practical AI, alongside the user-confirmed AI & Data Scientist role at SAP since April 2025, covering agentic AI use cases, large datasets, agent evaluation, and exploring new agent ideas. The default language is English.
4. **Public contact.** `mail@johanneskroll.com` comes from the supplied CV. Confirm that mailbox receives mail. The site opens visitors’ email applications; it does not send messages itself.
5. **Domain.** Use Firebase’s provided DNS records to connect the `www` domain and redirect the bare domain to it. If you choose a different canonical domain, update `astro.config.mjs` and `public/robots.txt` (the sitemap is generated from the site configuration), then rebuild.

No old CV download or portrait is published. The site uses only relevant professional/personal facts.

## Source notes

Source review: 13 September 2026. Content updated with Johannes’s instructions on 14 September 2026:

- **Direct updates from Johannes:** working at SAP as an AI & Data Scientist since April 2025, developing AI use cases with a focus on agentic systems and working with large datasets for evaluation and exploring new agent ideas; enthusiasm for open source; volunteering with SV 1880 München and Münchner Sportjugend. No specific title or responsibilities at Münchner Sportjugend, or open-source contribution history, have been inferred. The SV 1880 camp/event work and ZeitFrei volunteering are supported by the supplied CV.
- **User-provided `Johannes_CV.pdf` (dated December 2024):** TUM education; Westend61 development experience; BMW thesis/internship, RAG, LLM fine-tuning and deployment; Knapp Malerei web work in 2023; karate, travel and youth volunteering; domain email. The portrait has been removed at Johannes’s request. Statements marked “current” in that old document were not treated as current in 2026. The PDF remains outside this project.
- **[GitHub profile](https://github.com/JohannesKroll):** personal repositories and public profile links. Forked projects are not presented as original client work.
- **[MVG on Pi](https://github.com/JohannesKroll/mvg-on-pi):** a Python script that displays Munich transit information on a Raspberry Pi-connected 4×20 LCD. The portfolio’s LCD illustration is explicitly illustrative, not a live departure board or a photo of the device.
- **[QAOA maximum-clique project](https://github.com/JohannesKroll/QAOA-max-clique):** inspiration for the small graph puzzle. The website’s game is a simple interactive puzzle, not a quantum simulation.
- **[Knapp Malerei](https://knappmalerei.de/):** verified live client site, captured locally as a WebP thumbnail. The portfolio describes the 2023 design/development and maintenance work reported in the CV; it does not claim exclusive ownership of the current site or measurable business results.
- **[LinkedIn profile](https://www.linkedin.com/in/johannes-kroll-6b4248223/):** direct retrieval was blocked by LinkedIn. The correct supplied link is included, but no unverified details from search snippets were used.

## Images and fonts

- `src/assets/knapp-website.webp`: screenshot of the live client homepage. Astro creates 400px, 700px and 1000px WebP versions for responsive delivery.
- `public/images/social.png`: locally rendered, text-only social-sharing graphic matching the new design.
- `public/favicon.svg`: original vector wordmark.
- DM Sans is a locally served variable font from Fontsource. Its license is included in `public/fonts/`. Serif headings and monospaced labels use system fonts.

The game illustrations and LCD are code-native shapes. There is no portrait, generated identity photo, synthetic testimonial or invented client result.
