export interface Token {
  type: 'synonym' | 'word' | 'separator';
  position: number;
  length: number;
  value: string;
}

export function tokenize(query: string, synonyms: string[]) {
  const SPACE_OR_PUNCTUATION = /[\n\r\p{Z}\p{P}]/u;
  const tokens: Token[] = [];
  let remaining = `${query.toLowerCase()}`;
  let pos = 0;
  let state: Token = { type: 'separator', position: 0, length: 0, value: '' };

  while (remaining.length > 0) {
    let newState: Token | undefined = undefined;
    let forward = 1;

    if (state.type === 'separator') {
      let foundWord: string | undefined = undefined;
      for (const word of synonyms) {
        if (remaining.startsWith(word)) {
          foundWord = word;
          break;
        }
      }

      if (foundWord) {
        newState = {
          type: 'synonym',
          position: pos,
          length: foundWord.length,
          value: query.slice(pos, pos + foundWord.length),
        };
        forward = foundWord.length;
      } else if (remaining[0].match(SPACE_OR_PUNCTUATION)) {
        state.length += 1;
        state.value += query[pos];
      } else {
        newState = {
          type: 'word',
          position: pos,
          length: 1,
          value: query[pos],
        };
      }
    } else if (state.type === 'synonym') {
      if (remaining[0].match(SPACE_OR_PUNCTUATION)) {
        newState = {
          type: 'separator' as const,
          position: pos,
          length: 1,
          value: query[pos],
        };
      } else {
        const otherSynonyms = synonyms.filter(synonym => synonym !== state.value.toLowerCase());
        console.log('otherSynonyms', remaining, otherSynonyms);
        const previousRemaining = state.value.toLowerCase() + remaining;
        const match = otherSynonyms.find(synonym => previousRemaining.startsWith(synonym));
        console.log('match', match);
        if (match) {
          forward = match.length - state.length;
          state.length = match.length;
          state.value = query.slice(state.position, state.position + match.length);
        } else {
          state.type = 'word';
          state.length += 1;
          state.value += query[pos];
        }
        console.log('state', state);
      }
    } else { /* state.type === 'word' */
      if (remaining[0].match(SPACE_OR_PUNCTUATION)) {
        newState = {
          type: 'separator' as const,
          position: pos,
          length: 1,
          value: query[pos],
        };
      } else {
        state.length += 1;
        state.value += query[pos];
      }
    }

    if (newState) {
      if (state.length > 0) {
        tokens.push(state);
      }
      state = newState;
    }
    pos += forward;
    remaining = remaining.slice(forward);
  }

  if (state.length > 0) {
    tokens.push(state);
  }

  return tokens;
}