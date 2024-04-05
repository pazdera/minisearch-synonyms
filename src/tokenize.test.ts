import { describe, it, expect } from 'vitest';
import { tokenize } from './tokenize';

describe('tokenize()', () => {
  it('single word', () => {
    const res = tokenize('hello', []);
    expect(res).toEqual([
      { type: 'word', value: 'hello', position: 0, length: 5 }
    ]);
  });

  it('multiple words', () => {
    const res = tokenize('MuLtIpLe wOrDs', []);
    expect(res).toEqual([
      { type: 'word', value: 'multiple', position: 0, length: 8 },
      { type: 'separator', value: ' ', position: 8, length: 1 },
      { type: 'word', value: 'words', position: 9, length: 5 },
    ]);
  });

  it('preserves leading whitespace', () => {
    const res = tokenize('  hello', []);
    expect(res).toEqual([
      { type: 'separator', value: '  ', position: 0, length: 2 },
      { type: 'word', value: 'hello', position: 2, length: 5 },
    ]);
  });

  it('preserves leading punctuation', () => {
    const res = tokenize('...hello', []);
    expect(res).toEqual([
      { type: 'separator', value: '...', position: 0, length: 3 },
      { type: 'word', value: 'hello', position: 3, length: 5 },
    ]);
  });

  it('preserves leading punctuation and whitespace', () => {
    const res = tokenize(' -.,. hello', []);
    expect(res).toEqual([
      { type: 'separator', value: ' -.,. ', position: 0, length: 6 },
      { type: 'word', value: 'hello', position: 6, length: 5 },
    ]);
  });

  it('preserves trailing whitespace', () => {
    const res = tokenize('hello  ', []);
    expect(res).toEqual([
      { type: 'word', value: 'hello', position: 0, length: 5 },
      { type: 'separator', value: '  ', position: 5, length: 2 },
    ]);
  });

  it('preserves trailing punctuation', () => {
    const res = tokenize('hello...', []);
    expect(res).toEqual([
      { type: 'word', value: 'hello', position: 0, length: 5 },
      { type: 'separator', value: '...', position: 5, length: 3 },
    ]);
  });

  it('preserves trailing punctuation and whitespace', () => {
    const res = tokenize('hello -.,. ', []);
    expect(res).toEqual([
      { type: 'word', value: 'hello', position: 0, length: 5 },
      { type: 'separator', value: ' -.,. ', position: 5, length: 6 },
    ]);
  });

  it('handles blocks of whitespace', () => {
    const res = tokenize('hello \n world\n\nhi\n', []);
    expect(res).toEqual([
      { type: 'word', value: 'hello', position: 0, length: 5},
      { type: 'separator', value: ' \n ', position: 5, length: 3 },
      { type: 'word', value: 'world', position: 8, length: 5 },
      { type: 'separator', value: '\n\n', position: 13, length: 2 },
      { type: 'word', value: 'hi', position: 15, length: 2 },
      { type: 'separator', value: '\n', position: 17, length: 1 },
    ]);
  });

  it('handles whitespace and punctuation', () => {
    const res = tokenize('wicked, the weasel.\n', []);
    expect(res).toEqual([
      { type: 'word', value: 'wicked', position: 0, length: 6 },
      { type: 'separator', value: ', ', position: 6, length: 2 },
      { type: 'word', value: 'the', position: 8, length: 3 },
      { type: 'separator', value: ' ', position: 11, length: 1 },
      { type: 'word', value: 'weasel', position: 12, length: 6 },
      { type: 'separator', value: '.\n', position: 18, length: 2 },
    ]);
  });

  it('handles whitespace only', () => {
    const res = tokenize('   \n', []);
    expect(res).toEqual([
      { type: 'separator', value: '   \n', position: 0, length: 4 },
    ]);
  });

  it('handles punctuation only', () => {
    const res = tokenize('...---!!!', []);
    expect(res).toEqual([
      { type: 'separator', value: '...---!!!', position: 0, length: 9 },
    ]);
  });

  it('handles empty string', () => {
    const res = tokenize('', []);
    expect(res).toEqual([]);
  });

  it('matches a synonym', () => {
    const res = tokenize('hi mate', ['hi']);
    expect(res).toEqual([
      { type: 'synonym', value: 'hi', position: 0, length: 2 },
      { type: 'separator', value: ' ', position: 2, length: 1 },
      { type: 'word', value: 'mate', position: 3, length: 4 },
    ]);
  });

  it('won\'t match a synonym as a prefix', () => {
    const res = tokenize('hilly landscape', ['hi']);
    expect(res).toEqual([
      { type: 'word', value: 'hilly', position: 0, length: 5 },
      { type: 'separator', value: ' ', position: 5, length: 1 },
      { type: 'word', value: 'landscape', position: 6, length: 9 },
    ]);
  });

  it('won\'t match a synonym as a suffix', () => {
    const res = tokenize('hilly landscape', ['cape']);
    expect(res).toEqual([
      { type: 'word', value: 'hilly', position: 0, length: 5 },
      { type: 'separator', value: ' ', position: 5, length: 1 },
      { type: 'word', value: 'landscape', position: 6, length: 9 },
    ]);
  });

  it('works with synonyms with punctuation', () => {
    const res = tokenize('visit radek.io.', ['radek.io']);
    expect(res).toEqual([
      { type: 'word', value: 'visit', position: 0, length: 5 },
      { type: 'separator', value: ' ', position: 5, length: 1 },
      { type: 'synonym', value: 'radek.io', position: 6, length: 8 },
      { type: 'separator', value: '.', position: 14, length: 1 },
    ]);
  });

  it('works with synonyms that have spaces', () => {
    const res = tokenize('On artificial intelligence.', ['artificial intelligence']);
    expect(res).toEqual([
      { type: 'word', value: 'on', position: 0, length: 2 },
      { type: 'separator', value: ' ', position: 2, length: 1 },
      { type: 'synonym', value: 'artificial intelligence', position: 3, length: 23 },
      { type: 'separator', value: '.', position: 26, length: 1 },
    ]);
  });

  it('works with multiple synonyms', () => {
    const res = tokenize('hi hello', ['hello', 'hi']);
    expect(res).toEqual([
      { type: 'synonym', value: 'hi', position: 0, length: 2 },
      { type: 'separator', value: ' ', position: 2, length: 1 },
      { type: 'synonym', value: 'hello', position: 3, length: 5 },
    ]);
  });

  it('works with overlaping synonyms', () => {
    const res = tokenize('hi hill ill', ['hill', 'hi', 'ill']);
    expect(res).toEqual([
      { type: 'synonym', value: 'hi', position: 0, length: 2 },
      { type: 'separator', value: ' ', position: 2, length: 1 },
      { type: 'synonym', value: 'hill', position: 3, length: 4 },
      { type: 'separator', value: ' ', position: 7, length: 1 },
      { type: 'synonym', value: 'ill', position: 8, length: 3 },
    ]);
  });

  it('works with overlaping synonyms (shorter tests first)', () => {
    const res = tokenize('hi hill ill', ['hi', 'hill', 'ill']);
    expect(res).toEqual([
      { type: 'synonym', value: 'hi', position: 0, length: 2 },
      { type: 'separator', value: ' ', position: 2, length: 1 },
      { type: 'synonym', value: 'hill', position: 3, length: 4 },
      { type: 'separator', value: ' ', position: 7, length: 1 },
      { type: 'synonym', value: 'ill', position: 8, length: 3 },
    ]);
  });
});
