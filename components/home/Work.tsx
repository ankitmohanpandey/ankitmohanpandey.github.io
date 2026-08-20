import { work } from '@/lib/work';

export function Work() {
  if (work.length === 0) return null;

  return (
    <div className="divide-y divide-line border-y border-line">
      {work.map((item) => {
        const Wrapper = item.href ? 'a' : 'div';

        return (
          <Wrapper
            key={item.title}
            {...(item.href
              ? { href: item.href, target: '_blank', rel: 'noreferrer noopener' }
              : {})}
            className="group block py-7 transition-colors sm:grid sm:grid-cols-[6rem_1fr] sm:gap-8"
          >
            <div className="font-mono text-xs text-dim">{item.year}</div>

            <div className="mt-2 sm:mt-0">
              <h3 className="text-lg font-semibold text-bright">
                {item.title}
                {item.href && (
                  <span className="ml-2 inline-block text-signal opacity-0 transition-opacity group-hover:opacity-100">
                    ↗
                  </span>
                )}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {item.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-dim">
                {item.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
