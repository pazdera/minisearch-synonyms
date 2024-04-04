import { describe, it, expect } from 'vitest';
import { tokenize } from './tokenize';


describe('tokenize()', () => {
  it('single word', () => {
    const res = tokenize('hello');
    expect(res).toEqual([{ type: 'word', value: 'hello' }]);
  });

  it('multiple words', () => {
    const res = tokenize('MuLtIpLe wOrDs');
    expect(res).toEqual([
      { type: 'word', value: 'MuLtIpLe' },
      { type: 'separator', value: ' ' },
      { type: 'word', value: 'wOrDs' },
    ]);
  });

  it('preserves leading whitespace', () => {
    const res = tokenize('  hello');
    expect(res).toEqual([
      { type: 'separator', value: '  ' },
      { type: 'word', value: 'hello' },
    ]);
  });

  it('preserves leading punctuation', () => {
    const res = tokenize('...hello');
    expect(res).toEqual([
      { type: 'separator', value: '...' },
      { type: 'word', value: 'hello' },
    ]);
  });

  it('preserves leading punctuation and whitespace', () => {
    const res = tokenize(' -.,. hello');
    expect(res).toEqual([
      { type: 'separator', value: ' -.,. ' },
      { type: 'word', value: 'hello' },
    ]);
  });

  /* TODO: Is this the expected behaviour? */
  it('splits words with dashes', () => {
    const res = tokenize('c-sharp');
    expect(res).toEqual([
      { type: 'word', value: 'c' },
      { type: 'separator', value: '-' },
      { type: 'word', value: 'sharp' },
    ]);
  });

  it('preserves trailing whitespace', () => {
    const res = tokenize('hello  ');
    expect(res).toEqual([
      { type: 'word', value: 'hello' },
      { type: 'separator', value: '  ' },
    ]);
  });

  it('preserves trailing punctuation', () => {
    const res = tokenize('hello...');
    expect(res).toEqual([
      { type: 'word', value: 'hello' },
      { type: 'separator', value: '...' },
    ]);
  });

  it('preserves trailing punctuation and whitespace', () => {
    const res = tokenize('hello -.,. ');
    expect(res).toEqual([
      { type: 'word', value: 'hello' },
      { type: 'separator', value: ' -.,. ' },
    ]);
  });

  it('handles blocks of whitespace', () => {
    const res = tokenize('hello \n world\n\nhi\n');
    expect(res).toEqual([
      { type: 'word', value: 'hello' },
      { type: 'separator', value: ' \n ' },
      { type: 'word', value: 'world' },
      { type: 'separator', value: '\n\n' },
      { type: 'word', value: 'hi' },
      { type: 'separator', value: '\n' },
    ]);
  });

  it('handles whitespace and punctuation', () => {
    const res = tokenize('wicked, the weasel.\n');
    expect(res).toEqual([
      { type: 'word', value: 'wicked' },
      { type: 'separator', value: ', ' },
      { type: 'word', value: 'the' },
      { type: 'separator', value: ' ' },
      { type: 'word', value: 'weasel' },
      { type: 'separator', value: '.\n' },
    ]);
  });

  it('handles whitespace only', () => {
    const res = tokenize('   \n');
    expect(res).toEqual([{ type: 'separator', value: '   \n' }]);
  });

  it('handles punctuation only', () => {
    const res = tokenize('...---!!!');
    expect(res).toEqual([{ type: 'separator', value: '...---!!!' }]);
  });

  it('handles empty string', () => {
    const res = tokenize('');
    expect(res).toEqual([]);
  });
});
