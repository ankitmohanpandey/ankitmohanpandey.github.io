import { site } from '@/lib/site';

export function Subscribe() {
  return (
    <section className="newsletter-panel">
      <div className="relative max-w-2xl">
        <div className="eyebrow text-signal">Keep the curiosity going</div>
        <h2 className="editorial-title mt-4 text-balance text-3xl leading-tight text-bright sm:text-5xl">
          Technology worth your time.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
          Useful ideas, things I&apos;ve learned, and discoveries worth passing on.
          If that sounds like your kind of reading, join me on Substack.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <a href={site.socials.substack} target="_blank" rel="noreferrer noopener" className="action-primary">
            Subscribe on Substack <span aria-hidden="true">↗</span>
          </a>
          <a href="/rss.xml" className="text-sm text-muted transition-colors hover:text-signal">Prefer RSS? Follow the feed →</a>
        </div>
      </div>
      <div aria-hidden="true" className="newsletter-mark">&amp;</div>
    </section>
  );
}
