import { describe, expect, it } from 'vitest';
import {
  getAdjacentUnits,
  getCourses,
  getTopics,
  getUnitMarkdown,
  getUnits,
} from './content';

describe('content', () => {
  it('lists all 17 topics sorted by slug', () => {
    const topics = getTopics();
    expect(topics.length).toBe(17);
    expect(topics[0].slug).toBe('01foundations');
    expect(topics[0].title.length).toBeGreaterThan(0);
  });

  it('lists courses for a known topic', () => {
    const courses = getCourses('01foundations');
    expect(courses.map((c) => c.slug)).toContain('linux-for-robotics');
  });

  it('lists units for a known course in order', () => {
    const units = getUnits('01foundations', 'linux-for-robotics');
    expect(units.map((u) => u.slug)).toEqual([
      '01-introduction',
      '02-linux-essentials',
      '03-advanced-utilities-i',
      '04-advanced-utilities-ii',
    ]);
  });

  it('reads unit markdown content', () => {
    const md = getUnitMarkdown('01foundations', 'linux-for-robotics', '01-introduction');
    expect(md).toContain('Linux for Robotics');
  });

  it('computes adjacent units at the boundaries', () => {
    const { prev, next } = getAdjacentUnits(
      '01foundations',
      'linux-for-robotics',
      '01-introduction',
    );
    expect(prev).toBeNull();
    expect(next?.slug).toBe('02-linux-essentials');
  });
});
