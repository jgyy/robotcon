'use client';

import { useEffect, useId, useRef } from 'react';

export function MermaidDiagram({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '-');

  useEffect(() => {
    let cancelled = false;
    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
      mermaid.render(`mermaid-${id}`, source).then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, [id, source]);

  return <div ref={ref} className="mermaid-diagram" />;
}
