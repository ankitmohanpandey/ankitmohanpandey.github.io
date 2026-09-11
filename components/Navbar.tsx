'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navigation, site } from '@/lib/site';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // With nested routes like /blog and /blog/topics, only the most specific
  // matching item should light up — not every ancestor segment.
  const activeHref = [...navigation]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)))
    ?.href;

  const isActive = (href: string) => href === activeHref;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/80 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="group flex items-center gap-2.5 font-mono text-sm">
          <span className="inline-block size-2 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal)]" />
          <span className="text-fg transition-colors group-hover:text-bright">
            {site.name}
          </span>
          <span className="text-dim">/</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-1.5 font-mono text-sm transition-colors',
                isActive(item.href)
                  ? 'text-bright'
                  : 'text-dim hover:text-fg'
              )}
            >
              {isActive(item.href) && <span className="text-signal">~</span>}
              {item.label}
            </Link>
          ))}
          <a
            href={site.socials.substack}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-3 rounded-md border border-line-strong px-3 py-1.5 font-mono text-sm text-fg transition-colors hover:border-signal hover:text-signal"
          >
            subscribe
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation"
          className="font-mono text-sm text-dim transition-colors hover:text-fg lg:hidden"
        >
          {open ? '[x]' : '[=]'}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line px-6 py-3 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'block py-2 font-mono text-sm',
                isActive(item.href) ? 'text-signal' : 'text-dim'
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={site.socials.substack}
            target="_blank"
            rel="noreferrer noopener"
            className="block py-2 font-mono text-sm text-dim"
          >
            subscribe
          </a>
        </div>
      )}
    </header>
  );
}
