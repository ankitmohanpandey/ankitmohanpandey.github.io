'use client';

import { useState } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const codeText = String(children) || '';
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = className.replace(/language-/, '') || 'code';

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="rounded-lg bg-gray-900 p-4">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
