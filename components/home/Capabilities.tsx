import { capabilities } from '@/lib/work';

export function Capabilities() {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
      {capabilities.map((item, index) => (
        <div key={item.area} className="group bg-base p-6 transition-colors hover:bg-surface">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-dim">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className="text-lg font-semibold text-bright">{item.area}</h3>
            <span className="ml-auto font-mono text-[10px] text-dim opacity-0 transition-opacity group-hover:opacity-100">
              ↳
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted">{item.detail}</p>

          <div className="mt-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-dim">
              stack
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {item.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded border border-line bg-raised px-2 py-0.5 font-mono text-[11px] text-dim transition-colors group-hover:border-line-strong"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
