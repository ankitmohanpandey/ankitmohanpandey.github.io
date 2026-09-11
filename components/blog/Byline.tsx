import { formatDate } from '@/lib/utils';

interface BylineProps {
  author: string;
  publishedDate: string;
  readingTime: number;
  category?: string;
}

/** Initials for the avatar chip — e.g. "Ankit Mohan Pandey" -> "AP". */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function Byline({ author, publishedDate, readingTime, category }: BylineProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] text-dim">
      <div className="flex items-center gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong bg-raised text-[10px] font-semibold text-fg">
          {initials(author)}
        </span>
        <span className="text-muted">{author}</span>
      </div>
      <span className="text-line-strong">·</span>
      <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
      <span className="text-line-strong">·</span>
      <span>{readingTime} min read</span>
      {category && (
        <>
          <span className="text-line-strong">·</span>
          <span className="rounded border border-line bg-raised px-1.5 py-0.5 text-[10px] text-dim">
            {category}
          </span>
        </>
      )}
    </div>
  );
}
