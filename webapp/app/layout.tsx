import type { ReactNode } from 'react';
import { NavBar } from '../components/NavBar';
import 'highlight.js/styles/github-dark.css';
import './globals.css';

export const metadata = {
  title: 'robotcon',
  description: 'Personal robotics learning roadmap and quiz',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
