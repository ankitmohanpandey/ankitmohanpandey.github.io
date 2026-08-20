export const site = {
  name: 'Ankit Mohan Pandey',
  handle: 'ankitmohanpandey',
  role: 'Senior Data Engineer',
  url: 'https://ankitmohanpandey.in',
  description:
    'Senior Data Engineer building streaming and batch data platforms on GCP with Apache Beam, Airflow, BigQuery and Flink.',
  location: 'India',
  email: 'hello@ankitmohanpandey.in',
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
] as const;
