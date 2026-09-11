export const site = {
  name: 'Ankit Mohan Pandey',
  handle: 'ankitmohanpandey',
  role: 'Senior Data Engineer',
  url: 'https://ankitmohanpandey.in',
  description:
    'Senior Data Engineer building reliable data platforms on Google Cloud and exploring practical AI applications, emerging technology, and real industry problems.',
  location: 'India',
  email: 'ankitmohanpandey@outlook.com',
  socials: {
    github: 'https://github.com/ankitmohanpandey',
    linkedin: 'https://www.linkedin.com/in/ankitmohanpandey',
    substack: 'https://ankitmohanpandey.substack.com',
    x: 'https://x.com/ankitmohanpandey',
  },
  /** Public RSS feed used to mirror Substack essays onto the site. */
  substackFeed: 'https://ankitmohanpandey.substack.com/feed',
} as const;

export const navigation = [
  { href: '/', label: 'index' },
  { href: '/about', label: 'about' },
  { href: '/blog', label: 'writing' },
  { href: '/blog/topics', label: 'topics' },
] as const;
