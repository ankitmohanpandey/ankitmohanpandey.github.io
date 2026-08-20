import Link from 'next/link';
import { site } from '@/lib/site';
import { Container } from '@/components/Shell';
import { Pipeline } from '@/components/home/Pipeline';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-signal/8 blur-[120px]" />

      <Container className="relative py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-[11px] text-muted">
              <span className="size-1.5 rounded-full bg-signal animate-flow" />
              open to interesting data problems
            </div>

            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-bright sm:text-6xl">
              I build data systems
              <br />
              that don&apos;t{' '}
              <span className="text-signal">lose events</span>.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              I&apos;m {site.name.split(' ')[0]} — a {site.role.toLowerCase()} working on
              streaming and batch platforms with Apache Beam, Flink, Airflow and
              BigQuery. I care about correctness under failure, and about the boring
              operational details that decide whether a pipeline survives its
              second year.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/blog"
                className="rounded-md bg-signal px-5 py-2.5 font-mono text-sm font-medium text-void transition-opacity hover:opacity-90"
              >
                read the writing
              </Link>
              <Link
                href="/about"
                className="rounded-md border border-line-strong px-5 py-2.5 font-mono text-sm text-fg transition-colors hover:border-dim"
              >
                what I work on
              </Link>
              <a
                href={site.socials.github}
                target="_blank"
                rel="noreferrer noopener"
                className="px-2 py-2.5 font-mono text-sm text-dim transition-colors hover:text-signal"
              >
                github ↗
              </a>
            </div>
          </div>

          <div className="animate-rise [animation-delay:120ms]">
            <Pipeline />
          </div>
        </div>
      </Container>
    </section>
  );
}
