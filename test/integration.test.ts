import MiniSearch from 'minisearch';
import { MiniSearchSynonyms } from '../src';
import { test, expect } from 'vitest';

const documents = [
  {
    id: 1,
    title: 'Auto Repair Manual',
    text: 'Automobile maintenance is vital to keep your car running well and to ensure its long life.',
    category: 'non-fiction'
  },
  {
    id: 2,
    title: 'Zen and the Art of Motorcycle Maintenance',
    text: 'I can see by my watch without taking my hand from the left grip of the cycle...',
    category: 'non-fiction'
  },
  {
    id: 3,
    title: 'Car Maintenance for Dummies',
    text: 'Does your pride and joy need some loving attention?',
    category: 'non-fiction'
  },
  {
    id: 4,
    title: 'Vehicle Maintenance Log Book',
    text: 'This log book is designed to help you keep track of your vehicle maintenance and repairs.',
    category: 'non-fiction'
  },
];

const miniSearch = new MiniSearch({
  fields: ['title', 'text'],
  storeFields: ['title', 'category'],
});

miniSearch.addAll(documents);

test('MiniSearchSynonyms works with a single term', () => {
  const synonyms = new MiniSearchSynonyms([
    ['auto', 'car', 'vehicle'],
    ['maintenance', 'repair'],
  ]);

  const res = miniSearch.search(synonyms.expandQuery('car'));
  expect(res.length).toBe(3);

  expect(res[0].id).toBe(1);
  expect(res[0].queryTerms).toEqual(['car', 'auto']);

  expect(res[1].id).toBe(4);
  expect(res[1].queryTerms).toEqual(['vehicle']);

  expect(res[2].id).toBe(3);
  expect(res[2].queryTerms).toEqual(['car']);
});

test('MiniSearchSynonyms works when no synonyms are found', () => {
  const synonyms = new MiniSearchSynonyms([
    ['auto', 'car', 'vehicle'],
    ['maintenance', 'repair'],
  ]);

  const res = miniSearch.search(synonyms.expandQuery('my watch'));
  expect(res.length).toBe(1);

  expect(res[0].id).toBe(2);
  expect(res[0].queryTerms).toEqual(['my', 'watch']);
});

test('MiniSearchSynonyms works with multiple synonym matches', () => {
  const synonyms = new MiniSearchSynonyms([
    ['auto', 'car', 'vehicle'],
    ['maintenance', 'repair'],
  ]);

  const res = miniSearch.search(synonyms.expandQuery('car maintenance'));
  expect(res.length).toBe(4);

  expect(res[0].id).toBe(1);
  expect(res[0].queryTerms).toEqual(['car', 'maintenance', 'auto', 'repair']);

  expect(res[1].id).toBe(4);
  expect(res[1].queryTerms).toEqual(['maintenance', 'vehicle']);

  expect(res[2].id).toBe(3);
  expect(res[2].queryTerms).toEqual(['car', 'maintenance']);

  expect(res[3].id).toBe(2);
  expect(res[3].queryTerms).toEqual(['maintenance']);
  // expect(res[0].queryTerms).toEqual(['my', 'watch']);
});
