import { tokenize } from './tokenize';


export class MiniSearchSynonyms {
  private groups: string[][];
  private wordmap: Map<string, string[]>;

  constructor(groups: string[][] = []) {
    this.groups = groups;
    this.wordmap = new Map();

    for (const group of groups) {
      this.addSynonyms(group);
    }
  }

  addSynonyms(group: string[]) {
    for (const word of group) {
      if (this.wordmap.has(word)) {
        throw new Error(`Word "${word}" cannot be in multiple groups`);
      }
    }

    const newGroup = group.map(w => w.toLowerCase()).sort();
    this.groups.push(newGroup);

    for (const word of newGroup) {
      this.wordmap.set(word, newGroup);
    }
  }

  removeSynonyms(word: string) {
    const groupIndex = this.groups.findIndex(group => group.includes(word.toLowerCase()));

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

    const tokens = tokenize(query);
    const keywordOptions: { [index: number]: string[] } = {};

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'word') {
        const word = token.value.toLowerCase();
        const synonyms = this.getSynonyms(word);
        if (synonyms.length > 0) {
          keywordOptions[i] = [word, ...synonyms];
        }
      }
    }


    const queries: string[] = [];

  }
}
