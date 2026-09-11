interface TldrProps {
  summary: string;
}

/** Callout box surfacing the frontmatter `summary` right above the article body. */
export function Tldr({ summary }: TldrProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface/60 p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-signal/10 blur-2xl" />
      <div className="eyebrow">tl;dr</div>
      <p className="relative mt-2 text-[15px] leading-relaxed text-fg">{summary}</p>
    </div>
  );
}
