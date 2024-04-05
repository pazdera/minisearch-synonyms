import { tokenize } from './tokenize';

export class MiniSearchSynonyms {
  private groups: string[][];
  private wordmap: Map<string, string[]>;

  constructor(groups?: string[][]) {
    this.groups = [];
    this.wordmap = new Map();

    if (groups) {
      for (const group of groups) {
        this.addSynonyms(group);
      }
    }
  }

  addSynonyms(group: string[]) {
    if (group.length < 2) {
      throw new Error('Synonym must have at least 2 words');
    }

    let uniqueWords: string[] = [];
    for (const word of group) {
      if (this.wordmap.has(word)) {
        throw new Error(`Word \`${word}\` cannot be in multiple groups`);
      }

      if (uniqueWords.includes(word)) {
        throw new Error(`Duplicate synonym: \`${word}\``);
      }
      uniqueWords.push(word);
    }

    const newGroup = group.map(w => w.toLowerCase()).sort();
    this.groups.push(newGroup);

    for (const word of newGroup) {
      this.wordmap.set(word, newGroup);
    }
  }

  removeSynonyms(word: string) {
    const lowerCaseWord = word.toLowerCase();
    const groupIndex = this.groups.findIndex(group => group.includes(lowerCaseWord));

    if (groupIndex >= 0) {
      const group = this.groups[groupIndex];
      for (const w of group) {
        this.wordmap.delete(w);
      }

      this.groups.splice(groupIndex, 1);
    }
  }

  getSynonyms(word: string) {
    const lowerCaseWord = word.toLowerCase();
    const synonyms = this.wordmap.get(lowerCaseWord) || [];
    return synonyms.filter(synonym => synonym !== lowerCaseWord);
  }

  expandQuery(query: string) {
    if (!query || query.length === 0) {
      return query;
    }

    const tokens = tokenize(query, this.groups.flat());
    const synonymOptions: { [index: string]: string[] } = {};

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'synonym') {
        const word = token.value.toLowerCase();
        const synonyms = this.getSynonyms(word);

        if (synonyms.length > 0) {
          synonymOptions[i.toString()] = [word, ...synonyms];
        }
      }
    }

    const synonymCombinations: { [index: string]: string }[] = this.generateKeywordCombinations(synonymOptions, []);
    const queries = synonymCombinations.map(combination => {
      return tokens.map((token, i) => {
        const iStr = i.toString();
        return synonymOptions[iStr] ? combination[iStr] : token.value;
      }).join('');
    });

    if (queries.length === 0) {
      return query;
    }

    return {
      combineWith: 'OR',
      queries
    };
  }

  private generateKeywordCombinations(synonymOptions: { [index: string]: string[] }, combinations: { [index: string]: string }[]) {
    const keys = Object.keys(synonymOptions);
    if (keys.length === 0) {
      return combinations;
    }

    const key = keys[0];
    const newCombinations: { [index: string]: string }[] = [];

    if (Object.keys(combinations).length === 0) {
      for (const option of synonymOptions[key]) {
        newCombinations.push({ [key]: option });
      }
    } else {
      for (const option of synonymOptions[key]) {
        for (const combination of combinations) {
          newCombinations.push({ ...combination, [key]: option });
        }
      }
    }

    const remainingOptions = Object.fromEntries(Object.entries(synonymOptions).filter(([k]) => k !== key));
    return this.generateKeywordCombinations(remainingOptions, newCombinations);
  }
}

export default MiniSearchSynonyms;
