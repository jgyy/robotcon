import fs from 'node:fs';
import path from 'node:path';
import { Markdown } from '../lib/markdown';
import { TopicList } from '../components/TopicList';

function getRootReadme(): string {
  return fs.readFileSync(path.join(process.cwd(), '..', 'README.md'), 'utf8');
}

export default function HomePage() {
  const readme = getRootReadme();
  return (
    <main>
      <Markdown source={readme} />
      <h2>Topics</h2>
      <TopicList />
    </main>
  );
}
