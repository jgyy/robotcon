import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdjacentUnits, getUnitMarkdown, getUnits } from '../../../../../lib/content';
import { Markdown } from '../../../../../lib/markdown';

export default function UnitPage({
  params,
}: {
  params: { topic: string; course: string; unit: string };
}) {
  const units = getUnits(params.topic, params.course);
  const unit = units.find((u) => u.slug === params.unit);
  if (!unit) notFound();

  const markdown = getUnitMarkdown(params.topic, params.course, params.unit);
  const { prev, next } = getAdjacentUnits(params.topic, params.course, params.unit);

  return (
    <main>
      <Markdown source={markdown} />
      <nav className="unit-pager">
        {prev ? (
          <Link href={`/topics/${params.topic}/${params.course}/${prev.slug}`}>← {prev.title}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/topics/${params.topic}/${params.course}/${next.slug}`}>{next.title} →</Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
