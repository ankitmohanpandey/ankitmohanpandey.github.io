import Link from 'next/link';
import { navigation, site } from '@/lib/site';

const external = [
  { href: site.socials.github, label: 'github' },
  { href: site.socials.linkedin, label: 'linkedin' },
  { href: site.socials.substack, label: 'substack' },
  { href: '/rss.xml', label: 'rss' },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-mono text-sm text-fg">{site.handle}</div>
            <p className="mt-2 max-w-xs text-sm text-dim">
              Building thoughtful data systems. Sharing useful ideas about
              technology. Always making room to learn.
            </p>
          </div>

          <div className="flex gap-12">
            <nav className="flex flex-col gap-2">
              <span className="eyebrow">site</span>
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-mono text-sm text-dim transition-colors hover:text-signal"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <nav className="flex flex-col gap-2">
              <span className="eyebrow">elsewhere</span>
              {external.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-sm text-dim transition-colors hover:text-signal"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-xs text-dim sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>built with next.js · deployed on vercel</span>
        </div>
      </div>
    </footer>
  );
}
