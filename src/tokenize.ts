export interface Token {
  type: 'word' | 'separator';
  value: string;
}

export function tokenize(query: string) {
  const SPACE_OR_PUNCTUATION = /[\n\r\p{Z}\p{P}]+/u;

  const tokens: Token[] = [];

  let remaining = query;
  while (remaining) {
    const match = remaining.match(SPACE_OR_PUNCTUATION);
    if (match) {
      const keyword = remaining.slice(0, match.index);
      const separator = match[0];

      if (keyword) {
        tokens.push({ type: 'word', value: keyword });
      }
      tokens.push({ type: 'separator', value: separator });

      remaining = remaining.slice(match.index! + match[0].length);
    } else {
      tokens.push({ type: 'word', value: remaining });
      remaining = '';
    }
  }

  return tokens;
}
