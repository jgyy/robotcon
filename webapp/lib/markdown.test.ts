import { describe, expect, it } from 'vitest';
import { extractLanguage } from './markdown';

describe('extractLanguage', () => {
  it('extracts the language from a rehype-highlight className', () => {
    expect(extractLanguage('language-mermaid')).toBe('mermaid');
    expect(extractLanguage('language-bash')).toBe('bash');
  });

  it('returns null when there is no language class', () => {
    expect(extractLanguage(undefined)).toBeNull();
    expect(extractLanguage('some-other-class')).toBeNull();
  });
});
