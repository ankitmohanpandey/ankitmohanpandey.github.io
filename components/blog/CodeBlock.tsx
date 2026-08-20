'use client';

import { useRef, useState } from 'react';

interface CodeBlockProps {
  children?: React.ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  // Read the rendered text instead of the React children, which are nested
  // highlight.js spans rather than a plain string.
  const handleCopy = async () => {
    const text = ref.current?.innerText ?? '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded border border-line bg-raised px-2 py-1 font-mono text-[11px] text-dim opacity-0 transition-all hover:text-signal focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? 'copied' : 'copy'}
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}
