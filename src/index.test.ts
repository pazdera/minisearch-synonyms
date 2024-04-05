import { describe, expect, it } from 'vitest';
import { MiniSearchSynonyms } from '.';

describe('MiniSearchSynonyms', () => {
  describe('.constructor()', () => {
    it('creates a new instance with no groups', () => {
      const synonyms = new MiniSearchSynonyms();

      expect(synonyms['groups']).toEqual([]);
    });

    it('creates a new instance with a group', () => {
      const synonyms = new MiniSearchSynonyms([['auto', 'car', 'vehicle']]);

      expect(synonyms['groups']).toEqual([['auto', 'car', 'vehicle']]);

      expect(synonyms['wordmap'].get('auto')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('car')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('vehicle')).toEqual(['auto', 'car', 'vehicle']);
    });

    it('converts words to lowercase', () => {
      const synonyms = new MiniSearchSynonyms([['Auto', 'Car', 'Vehicle']]);

      expect(synonyms['groups']).toEqual([['auto', 'car', 'vehicle']]);

      expect(synonyms['wordmap'].get('auto')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('car')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('vehicle')).toEqual(['auto', 'car', 'vehicle']);
    });

    it('accepts an empty array', () => {
      const synonyms = new MiniSearchSynonyms([]);

      expect(synonyms['groups']).toEqual([]);
    });

    it('rejects empty groups', () => {
      const groups = [[]];
      expect(() => new MiniSearchSynonyms(groups)).toThrowError('Synonym must have at least 2 words');
    });

    it('rejects single word groups', () => {
      const groups = [['hi']];
      expect(() => new MiniSearchSynonyms(groups)).toThrowError('Synonym must have at least 2 words');
    });

    it('rejects groups with duplicate words', () => {
      const groups = [['hi', 'hi']];
      expect(() => new MiniSearchSynonyms(groups)).toThrowError('Duplicate synonym: `hi`');
    });

    it('rejects duplicate words across groups', () => {
      const groups = [['hello', 'hi'], ['hi', 'hey']];
      expect(() => new MiniSearchSynonyms(groups)).toThrowError('Word `hi` cannot be in multiple groups');
    });

    it('accepts synonyms that contain punctuation or whitespace', () => {
      const groups = [['hello-world', 'hi pal', 'hi']];
      const synonyms = new MiniSearchSynonyms(groups);

      expect(synonyms['groups']).toEqual([['hello-world', 'hi', 'hi pal']]);
    });
  });

  describe('.addSynonyms()', () => {
    it('adds a group of synonyms', () => {
      const synonyms = new MiniSearchSynonyms();
      synonyms.addSynonyms(['auto', 'car', 'vehicle']);

      expect(synonyms['groups']).toEqual([['auto', 'car', 'vehicle']]);

      expect(synonyms['wordmap'].get('auto')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('car')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('vehicle')).toEqual(['auto', 'car', 'vehicle']);
    });

    it('converts words to lowercase', () => {
      const synonyms = new MiniSearchSynonyms();
      synonyms.addSynonyms(['Auto', 'Car', 'Vehicle']);

      expect(synonyms['groups']).toEqual([['auto', 'car', 'vehicle']]);

      expect(synonyms['wordmap'].get('auto')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('car')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('vehicle')).toEqual(['auto', 'car', 'vehicle']);
    });

    it('rejects empty groups', () => {
      const synonyms = new MiniSearchSynonyms();
      expect(() => synonyms.addSynonyms([])).toThrowError('Synonym must have at least 2 words');
    });

    it('rejects single word groups', () => {
      const synonyms = new MiniSearchSynonyms();
      expect(() => synonyms.addSynonyms(['hi'])).toThrowError('Synonym must have at least 2 words');
    });

    it('rejects groups with duplicate words', () => {
      const synonyms = new MiniSearchSynonyms();
      expect(() => synonyms.addSynonyms(['hi', 'hi'])).toThrowError('Duplicate synonym: `hi`');
    });

    it('rejects duplicate words across groups', () => {
      const synonyms = new MiniSearchSynonyms();
      synonyms.addSynonyms(['hello', 'hi']);
      expect(() => synonyms.addSynonyms(['hi', 'hey'])).toThrowError('Word `hi` cannot be in multiple groups');
    });
  });

  describe('.removeSynonyms()', () => {
    it('removes a group of synonyms', () => {
      const synonyms = new MiniSearchSynonyms([['auto', 'car', 'vehicle']]);
      synonyms.removeSynonyms('auto');

      expect(synonyms['groups']).toEqual([]);
      expect(synonyms['wordmap'].get('auto')).toBeUndefined();
      expect(synonyms['wordmap'].get('car')).toBeUndefined();
      expect(synonyms['wordmap'].get('vehicle')).toBeUndefined();
    });

    it('does nothing if the word is not found', () => {
      const synonyms = new MiniSearchSynonyms([['auto', 'car', 'vehicle']]);
      synonyms.removeSynonyms('bike');

      expect(synonyms['groups']).toEqual([['auto', 'car', 'vehicle']]);
      expect(synonyms['wordmap'].get('auto')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('car')).toEqual(['auto', 'car', 'vehicle']);
      expect(synonyms['wordmap'].get('vehicle')).toEqual(['auto', 'car', 'vehicle']);
    });

    it('removing a group doesn\'t affect other groups', () => {
      const synonyms = new MiniSearchSynonyms([['auto', 'car', 'vehicle'], ['Bike', 'bicycle']]);
      synonyms.removeSynonyms('auto');

      expect(synonyms['groups']).toEqual([['bicycle', 'bike']]);
      expect(synonyms['wordmap'].get('auto')).toBeUndefined();
      expect(synonyms['wordmap'].get('car')).toBeUndefined();
      expect(synonyms['wordmap'].get('vehicle')).toBeUndefined();
      expect(synonyms['wordmap'].get('bike')).toEqual(['bicycle', 'bike']);
      expect(synonyms['wordmap'].get('bicycle')).toEqual(['bicycle', 'bike']);
    });

    it('is case insensitive', () => {
      const synonyms = new MiniSearchSynonyms([['auto', 'car', 'vehicle']]);
      synonyms.removeSynonyms('Auto');

      expect(synonyms['groups']).toEqual([]);
      expect(synonyms['wordmap'].get('auto')).toBeUndefined();
      expect(synonyms['wordmap'].get('car')).toBeUndefined();
      expect(synonyms['wordmap'].get('vehicle')).toBeUndefined();
    });
  });

  describe('.getSynonyms()', () => {
    it('returns synonyms for a word', () => {
      const synonyms = new MiniSearchSynonyms([['auto', 'car', 'vehicle']]);

      expect(synonyms.getSynonyms('auto')).toEqual(['car', 'vehicle']);
      expect(synonyms.getSynonyms('car')).toEqual(['auto', 'vehicle']);
      expect(synonyms.getSynonyms('vehicle')).toEqual(['auto', 'car']);
    });

    it('returns an empty array if the word is not found', () => {
      const synonyms = new MiniSearchSynonyms([['auto', 'car', 'vehicle']]);

      expect(synonyms.getSynonyms('bike')).toEqual([]);
    });

    it('is case insensitive', () => {
      const synonyms = new MiniSearchSynonyms([['auto', 'car', 'vehicle']]);

      expect(synonyms.getSynonyms('Auto')).toEqual(['car', 'vehicle']);
      expect(synonyms.getSynonyms('Car')).toEqual(['auto', 'vehicle']);
      expect(synonyms.getSynonyms('Vehicle')).toEqual(['auto', 'car']);
    });
  });

  describe('.expandQuery()', () => {
    it('returns the query if it is empty', () => {
      const synonyms = new MiniSearchSynonyms([
        ['auto', 'car', 'vehicle'],
        ['hello!', 'hi'],
        ['ai', 'artificial intelligence'],
      ]);
      expect(synonyms.expandQuery('')).toBe('');
    });

    it('returns the query if there are no synonyms', () => {
      const synonyms = new MiniSearchSynonyms([
        ['auto', 'car', 'vehicle'],
        ['hello!', 'hi'],
        ['ai', 'artificial intelligence'],
      ]);
      expect(synonyms.expandQuery('hia friend')).toBe('hia friend');
    });

    it('expands a query with a single synonym', () => {
      const synonyms = new MiniSearchSynonyms([
        ['auto', 'car', 'vehicle'],
        ['hello!', 'hi'],
        ['ai', 'artificial intelligence'],
      ]);

      expect(synonyms.expandQuery('hello!')).toStrictEqual({
        combineWith: 'OR',
        queries: ['hello!', 'hi'],
      });
    });

    it('expands a query with a multiple occurencies of the same synonyms', () => {
      const synonyms = new MiniSearchSynonyms([
        ['auto', 'car', 'vehicle'],
        ['hello!', 'hi'],
        ['ai', 'artificial intelligence'],
      ]);

      expect(synonyms.expandQuery('hello! hi')).toStrictEqual({
        combineWith: 'OR',
        queries: [
          'hello! hi',
          'hi hi',
          'hello! hello!',
          'hi hello!',
        ],
      });
    });

    it('expands a query with a multiple synonyms', () => {
      const synonyms = new MiniSearchSynonyms([
        ['auto', 'car', 'vehicle'],
        ['hello!', 'hi'],
        ['ai', 'artificial intelligence'],
      ]);

      expect(synonyms.expandQuery('hi car')).toStrictEqual({
        combineWith: 'OR',
        queries: [
          'hi car',
          'hello! car',
          'hi auto',
          'hello! auto',
          'hi vehicle',
          'hello! vehicle',
        ],
      });
    });

    it('works with synonyms, words and punctuation', () => {
      const synonyms = new MiniSearchSynonyms([
        ['auto', 'car', 'vehicle'],
        ['hello!', 'hi'],
        ['ai', 'artificial intelligence'],
      ]);

      expect(synonyms.expandQuery('hi, car with ai')).toStrictEqual({
        combineWith: 'OR',
        queries: [
          'hi, car with ai',
          'hello!, car with ai',
          'hi, auto with ai',
          'hello!, auto with ai',
          'hi, vehicle with ai',
          'hello!, vehicle with ai',
          'hi, car with artificial intelligence',
          'hello!, car with artificial intelligence',
          'hi, auto with artificial intelligence',
          'hello!, auto with artificial intelligence',
          'hi, vehicle with artificial intelligence',
          'hello!, vehicle with artificial intelligence',
        ],
      });
    });
    // multiple matches
    // case insensitive
    // multiple words
    // multiple matches with multiple words
  });
});
