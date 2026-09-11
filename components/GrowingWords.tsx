'use client';

import { useEffect, useState } from 'react';

interface GrowingWordsProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

/**
 * Cycles through a list of words, each one easing in with the `word-grow`
 * keyframe — a small stand-in for "always eager to learn, growing
 * knowledge" without inventing fake stats. Pauses under
 * `prefers-reduced-motion` via the global animation-duration override.
 */
export function GrowingWords({ words, intervalMs = 2400, className }: GrowingWordsProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (words.length <= 1 || paused) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const id = setInterval(() => {
      if (!motion.matches && !document.hidden) {
        setIndex((current) => (current + 1) % words.length);
      }
    }, Math.max(1000, intervalMs));
    return () => clearInterval(id);
  }, [words.length, intervalMs, paused]);

  if (words.length === 0) return null;

  return (
    <span className={className ?? 'text-signal'}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className="inline-grid max-w-full align-middle">
        {words.map((word, position) => (
          <span key={`${position}-${word}`} className="invisible col-start-1 row-start-1">{word}</span>
        ))}
        <span key={index} className="animate-word-grow col-start-1 row-start-1 origin-left">
          {words[index % words.length]}
        </span>
      </span>
      {words.length > 1 && (
        <button type="button" onClick={() => setPaused((value) => !value)}
          aria-label={paused ? 'Resume rotating learning topics' : 'Pause rotating learning topics'}
          aria-pressed={paused}
          className="ml-3 rounded border border-line px-2 py-1 text-[10px] text-muted motion-reduce:hidden">
          {paused ? 'Resume' : 'Pause'}
        </button>
      )}
    </span>
  );
}
