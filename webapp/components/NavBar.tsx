import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="nav-bar">
      <Link href="/">Home</Link>
      <Link href="/topics">Browse</Link>
      <Link href="/quiz">Quiz</Link>
      <Link href="/quiz/history">History</Link>
    </nav>
  );
}
