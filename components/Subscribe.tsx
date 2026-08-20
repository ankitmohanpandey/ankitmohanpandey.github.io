import { site } from '@/lib/site';

export function Subscribe() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface/60 p-8 sm:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-signal/10 blur-3xl" />

      <div className="relative max-w-xl">
        <div className="eyebrow">newsletter</div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-bright">
          Occasional notes on data infrastructure
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Written on Substack, mirrored here automatically. No cadence promises —
          it goes out when there&apos;s something worth saying about streaming,
          warehousing or the failure modes in between.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={site.socials.substack}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md bg-signal px-5 py-2.5 font-mono text-sm font-medium text-void transition-opacity hover:opacity-90"
          >
            subscribe on substack
          </a>
          <a
            href="/rss.xml"
            className="font-mono text-sm text-dim transition-colors hover:text-signal"
          >
            or grab the rss feed
          </a>
        </div>
      </div>
    </div>
  );
}
