import Link from 'next/link';

interface BreadcrumbProps {
  topic?: { label: string; slug: string };
}

/** "writing / {topic}" trail above the post title, linking back to the taxonomy. */
export function Breadcrumb({ topic }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-dim">
      <Link href="/blog" className="transition-colors hover:text-signal">
        writing
      </Link>
      {topic && (
        <>
          <span className="mx-2 text-line-strong">/</span>
          <Link
            href={`/blog/topics/${topic.slug}`}
            className="transition-colors hover:text-signal"
          >
            {topic.label}
          </Link>
        </>
      )}
    </nav>
  );
}
