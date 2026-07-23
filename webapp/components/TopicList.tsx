import Link from 'next/link';
import { getTopics } from '../lib/content';

export function TopicList() {
  const topics = getTopics();
  return (
    <ul className="topic-list">
      {topics.map((topic) => (
        <li key={topic.slug}>
          <Link href={`/topics/${topic.slug}`}>{topic.title}</Link>
        </li>
      ))}
    </ul>
  );
}
