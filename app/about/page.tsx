import type { Metadata } from 'next';
import { Shell, Container } from '@/components/Shell';
import { Capabilities } from '@/components/home/Capabilities';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: site.description,
};

const principles = [
  {
    title: 'Correctness before throughput',
    body: 'A fast pipeline that silently drops late events is worse than a slow one that does not. Event-time semantics, watermarks and dead letter queues are not optional extras.',
  },
  {
    title: 'Failure is the normal case',
    body: 'Brokers restart, schemas drift, upstream teams ship breaking changes on a Friday. Designs get judged on what happens during the incident, not the happy path.',
  },
  {
    title: 'Make it runnable in one command',
    body: 'If a new engineer cannot bring the whole stack up locally, the system is harder than it needs to be. Containerised environments pay for themselves within a week.',
  },
  {
    title: 'Cost is a design constraint',
    body: 'Partitioning, clustering and materialisation choices show up on the invoice. Warehouse design is as much an economics problem as an engineering one.',
  },
];

const contact = [
  { label: 'email', value: site.email, href: `mailto:${site.email}` },
  { label: 'github', value: '@ankitmohanpandey', href: site.socials.github },
  { label: 'linkedin', value: '/in/ankitmohanpandey', href: site.socials.linkedin },
  { label: 'substack', value: 'ankitmohanpandey', href: site.socials.substack },
];

export default function AboutPage() {
  return (
    <Shell>
      <Container className="py-16 sm:py-20">
        <header className="border-b border-line pb-10">
          <div className="eyebrow">about</div>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight text-bright">
            Data engineer, mostly on the streaming side
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-muted">
            <p>
              I design and run the pipelines that move data from wherever it is
              produced to wherever someone needs to make a decision with it —
              usually on Google Cloud, usually with Apache Beam or Flink doing the
              heavy lifting and Airflow keeping the schedule honest.
            </p>
            <p>
              Most of my interesting work happens at the boundaries: late-arriving
              events, schema evolution, replaying a day of data without producing
              duplicates, keeping BigQuery costs from quietly tripling. That is the
              part I write about.
            </p>
          </div>
        </header>

        <section className="py-14">
          <div className="eyebrow mb-6">how I work</div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {principles.map((item) => (
              <div key={item.title} className="bg-base p-6">
                <h3 className="font-semibold text-bright">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-14">
          <div className="eyebrow mb-6">toolkit</div>
          <Capabilities />
        </section>

        <section className="border-t border-line pt-10">
          <div className="eyebrow mb-6">get in touch</div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {contact.map((item) => (
              <div key={item.label} className="flex items-baseline gap-4">
                <dt className="w-20 shrink-0 font-mono text-[11px] text-dim">
                  {item.label}
                </dt>
                <dd>
                  <a
                    href={item.href}
                    target={item.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    className="font-mono text-sm text-fg transition-colors hover:text-signal"
                  >
                    {item.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
    </Shell>
  );
}
