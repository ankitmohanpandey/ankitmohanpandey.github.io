import Link from 'next/link';
import { site } from '@/lib/site';
import { Container } from '@/components/Shell';
import { Pipeline } from '@/components/home/Pipeline';
import { GrowingWords } from '@/components/GrowingWords';
import { currentlyLearning } from '@/lib/work';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <Container className="relative py-16 sm:py-24">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
          <span className="eyebrow">{site.name} / {site.role}</span>
          <span className="font-mono text-[11px] text-muted">Build thoughtfully. Stay curious.</span>
        </div>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h1 className="editorial-title text-balance text-5xl leading-[1.04] text-bright sm:text-7xl">
              Reliable data.<br />
              <span className="italic text-signal">Intelligent possibilities.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
              I&apos;m Ankit, a senior data engineer building streaming and batch platforms.
              My focus is reliable systems, thoughtful trade-offs, and data people can trust.
              My curiosity is in what comes next: AI-driven applications, emerging tools,
              and turning new ideas into something useful.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/blog" className="action-primary">Explore the writing <span aria-hidden="true">↗</span></Link>
              <Link href="/about" className="action-secondary">Meet the engineer</Link>
            </div>
            <div className="mt-10 border-l-2 border-signal/50 pl-4">
              <div className="eyebrow mb-2">Always learning. Currently exploring</div>
              <GrowingWords words={currentlyLearning} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>Inside the work</span><span>01 / Streaming</span>
            </div>
            <Pipeline />
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted">
              An illustrative event stream. A small window into the systems I work on — not live production telemetry.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
