const stages = [
  { label: 'sources', detail: 'pub/sub · kafka · cdc' },
  { label: 'ingest', detail: 'beam · flink' },
  { label: 'transform', detail: 'windows · joins · dq' },
  { label: 'serve', detail: 'bigquery · api' },
];

/**
 * Purely decorative pipeline diagram. CSS-only so it costs no client JS —
 * the staggered pulses read as records moving between stages.
 */
export function Pipeline() {
  return (
    <div
      aria-hidden
      className="rounded-xl border border-line bg-surface/60 p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center gap-2 font-mono text-[11px] text-dim">
        <span className="size-1.5 rounded-full bg-signal animate-flow" />
        streaming topology · exactly-once
      </div>

      <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex min-w-0 flex-1 items-center gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-line-strong bg-base px-3 py-3">
              <div className="truncate font-mono text-xs text-fg">{stage.label}</div>
              <div className="mt-1 truncate font-mono text-[10px] text-dim">
                {stage.detail}
              </div>
            </div>

            {index < stages.length - 1 && (
              <div className="flex shrink-0 items-center gap-1">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="size-1 rounded-full bg-signal animate-flow"
                    style={{ animationDelay: `${index * 0.4 + dot * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 font-mono text-[11px]">
        {[
          { k: 'watermark', v: 'event-time' },
          { k: 'checkpoint', v: '5s' },
          { k: 'on failure', v: 'replay' },
        ].map((item) => (
          <div key={item.k}>
            <div className="text-dim">{item.k}</div>
            <div className="mt-0.5 text-signal">{item.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
