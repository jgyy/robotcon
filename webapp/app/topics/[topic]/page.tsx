import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourses, getTopicMarkdown, getTopics } from '../../../lib/content';
import { Markdown } from '../../../lib/markdown';

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topics = getTopics();
  const topic = topics.find((t) => t.slug === params.topic);
  if (!topic) notFound();

  const markdown = getTopicMarkdown(params.topic);
  const courses = getCourses(params.topic);

  return (
    <main>
      <Markdown source={markdown} />
      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.slug}>
            <Link href={`/topics/${params.topic}/${course.slug}`}>{course.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
