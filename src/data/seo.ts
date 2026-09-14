export const siteName = 'Johannes Kroll';
export const defaultTitle = 'Johannes Kroll — AI & Data Scientist, Software Developer';
export const defaultDescription =
  'AI & Data Scientist at SAP and freelance software developer. Agentic AI, large datasets, agent evaluation, business websites and custom software.';

// Keep this list to real, indexable pages. The imprint draft and 404 are excluded.
export const indexablePaths = ['/', '/privacy/'];

export function profileStructuredData(site: URL, title: string, description: string) {
  const home = site.href;
  const personId = new URL('#johannes', site).href;
  const websiteId = new URL('#website', site).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: siteName,
        url: home,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': new URL('#profile', site).href,
        url: home,
        name: title,
        description,
        inLanguage: 'en',
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: siteName,
        url: home,
        jobTitle: 'AI & Data Scientist',
        description:
          'AI & Data Scientist at SAP since April 2025, developing AI use cases and working with large datasets for agent evaluation and exploring new agent ideas. Also a freelance web and software developer.',
        worksFor: { '@type': 'Organization', name: 'SAP' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Technical University of Munich' },
        knowsAbout: [
          'Agentic AI',
          'Data science',
          'Agent evaluation',
          'Large language models',
          'Retrieval-augmented generation',
          'Web development',
          'Software development',
          'Open-source software',
        ],
        knowsLanguage: ['German', 'English'],
        sameAs: [
          'https://github.com/JohannesKroll',
          'https://www.linkedin.com/in/johannes-kroll-6b4248223/',
        ],
      },
    ],
  };
}
