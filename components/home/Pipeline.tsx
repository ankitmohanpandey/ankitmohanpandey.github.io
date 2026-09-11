import { StreamViz } from '@/components/home/StreamViz';

const facts = [
  { k: 'semantics', v: 'event-time' },
  { k: 'delivery', v: 'exactly-once' },
  { k: 'on failure', v: 'replay · DLQ' },
];

export function Pipeline() {
  return (
    <div className="group relative">
      {/* Accent bloom that intensifies on hover. */}
      <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-signal/25 via-flow/10 to-transparent opacity-40 blur-[2px] transition-opacity duration-500 group-hover:opacity-80" />

      <div className="relative overflow-hidden rounded-xl border border-line-strong bg-surface/90 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-signal" />
            </span>
            flink-agg · DEMO
          </div>
          <div className="font-mono text-[10px] text-dim">parallelism 4</div>
        </div>

        <StreamViz />

        <div className="grid grid-cols-3 divide-x divide-line border-t border-line font-mono text-[11px]">
          {facts.map((fact) => (
            <div key={fact.k} className="px-4 py-3">
              <div className="text-dim">{fact.k}</div>
              <div className="mt-0.5 text-signal">{fact.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
