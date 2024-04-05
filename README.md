# MiniSearch Synonyms

[![Tests](https://github.com/pazdera/minisearch-synonyms/actions/workflows/tests.yml/badge.svg)](https://github.com/pazdera/minisearch-synonyms/actions/workflows/tests.yml)
[![Coverage Status](https://coveralls.io/repos/github/pazdera/minisearch-synonyms/badge.svg?branch=main)](https://coveralls.io/github/pazdera/minisearch-synonyms?branch=main)
![NPM Version](https://img.shields.io/npm/v/minisearch-synonyms)
![License](https://img.shields.io/npm/l/minisearch-synonyms)
![NPM Type Definitions](https://img.shields.io/npm/types/minisearch-synonyms)

A tiny module that lets you add keyword synonyms to your [MiniSearch](https://github.com/lucaong/minisearch) queries.

## Installation

Using `npm`:

```bash
npm install --save minisearch-synonyms
```

Using `yarn`:

```bash
yarn add minisearch-synonyms
```

You can also access the package via a CDN:

```html
<script src="https://www.unpkg.com/minisearch-synonyms@latest/dist/index.global.js"></script>
```

Remember install `minisearch` as described in the [MiniSearch docs](https://github.com/lucaong/minisearch#installation).

## Usage

Import `minisearch-synonyms` alongside `minisearch`:

```typescript
import MiniSearch from 'minisearch';
import MiniSearchSynonyms from 'minisearch-synonyms';
```

Create an instance of `MiniSearchSynonyms` and define your synonyms:

```typescript
const synonyms = new MiniSearchSynonyms([
  ['car', 'auto', 'automobile', 'vehicle'],
  ['bike', 'bicycle']
]);
```

When searching, pass your query through the `expandQuery` method:

```typescript
const query = 'blue car';
const queryWithSynonyms = synonyms.expandQuery(query);

const results = miniSearch.search(queryWithSynonyms);
```

## How It Works

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
