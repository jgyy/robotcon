import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { MermaidDiagram } from '../components/MermaidDiagram';

export function extractLanguage(className?: string): string | null {
  if (!className) return null;
  const match = /language-(\w+)/.exec(className);
  return match ? match[1] : null;
}

function CodeBlock({ className, children }: ComponentPropsWithoutRef<'code'>) {
  if (!className) {
    return <code>{children}</code>;
  }
  const language = extractLanguage(className);
  if (language === 'mermaid') {
    const source = String(children).replace(/\n$/, '');
    return <MermaidDiagram source={source} />;
  }
  return (
    <pre>
      <code className={className}>{children}</code>
    </pre>
  );
}

export function Markdown({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{ code: CodeBlock }}>
      {source}
    </ReactMarkdown>
  );
}
