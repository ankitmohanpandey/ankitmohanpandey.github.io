import { FaqItem } from '@/lib/types/blog';

interface FaqSectionProps {
  items: FaqItem[];
}

/** Static Q&A list at the end of a post. JSON-LD for this lives in the page. */
export function FaqSection({ items }: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 border-t border-line pt-8">
      <div className="eyebrow mb-5">faq</div>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <h3 className="font-semibold text-bright">{item.question}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
