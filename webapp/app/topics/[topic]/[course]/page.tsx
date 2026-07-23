import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseMarkdown, getCourses, getUnits } from '../../../../lib/content';
import { Markdown } from '../../../../lib/markdown';

export default function CoursePage({
  params,
}: {
  params: { topic: string; course: string };
}) {
  const courses = getCourses(params.topic);
  const course = courses.find((c) => c.slug === params.course);
  if (!course) notFound();

  const markdown = getCourseMarkdown(params.topic, params.course);
  const units = getUnits(params.topic, params.course);

  return (
    <main>
      <Markdown source={markdown} />
      <h2>Units</h2>
      <ol>
        {units.map((unit) => (
          <li key={unit.slug}>
            <Link href={`/topics/${params.topic}/${params.course}/${unit.slug}`}>{unit.title}</Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
