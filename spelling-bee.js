const wordlist = require("wordlist-english");

class SpellingBee {
  constructor(wordlist, dialects) {
    this.wordList = wordlist;
    this.dialects = Object.keys(wordlist).filter(d => dialects.includes(d));
  }

  search(dictionary, letters, mustContain, length, startsWith) {
    const startIdx = dictionary.findIndex(w => w.startsWith(startsWith));
    const endIdx = dictionary.findIndex((w, i) => i > startIdx && !w.startsWith(startsWith));

    const searchableWords = dictionary.slice(startIdx, endIdx)

    return searchableWords
      .filter(w =>
        w.length === length
        && w.includes(mustContain)
        && w.split('').every(l => letters.includes(l))
      );
  }

  searchAll(letters, mustContain, length, startsWith) {
    return this.dialects.map((dialect) => {
      return {
        dialect,
        words: this.search(this.wordList[dialect], letters, mustContain, length, startsWith)
      };
    })
  }

  parseGrid(gridStr) {
    const SUMCHAR = 'Σ';
    const str = gridStr.trim();

    const data = str.split('\n')
      .map(l =>
        l.split(/\s+/)
          .map(c => c.trim())
          .filter(c => !!c)
      );

    const headers = data[0];
    headers.pop(); // remove sum

    const gridData = data.slice(1).reduce((g, row) => {
      const rowKey = row[0].replace(':', '');
      if (rowKey === SUMCHAR) {
        return g;
      }
      g[rowKey] = row.slice(1).reduce((r, count, i) => {
        if (!headers[i]) {
          return r;
        }
        r[headers[i]] = count === '-' ? 0 : parseInt(count);
        return r;
      }, {});

      return g;
    }, {})

    return gridData;
  }

  parseTwoletters(tlStr) {
    const lines = tlStr.trim().split('\n').map(l => l.trim()).filter(l => !!l);
    return lines
      .map(sec => sec.split(/\s+/))
      .reduce((arr, sub) => arr.concat(sub), [])
      .reduce((tlMap, tl) => {
        const [letters, count] = tl.split('-');
        tlMap[letters] = parseInt(count);
        return tlMap;
      }, {});
  }

  compareToHints(gridStr, tlStr, wordListStr) {
    const grid = this.parseGrid(gridStr);
    const tl = this.parseTwoletters(tlStr);

    wordListStr.trim().split('\n').forEach((raw) => {
      const word = raw.trim();
      if (!word) {
        return;
      }
      const firstLetter = word.charAt(0).toUpperCase();
      const firstTl = word.slice(0, 2).toUpperCase();
      const len = word.length;
      grid[firstLetter][len]--;
      tl[firstTl]--;
    });

    const letters = Object.keys(grid);
    const lengths = Object.keys(grid[letters[0]]);

    return { grid, tl, letters, lengths };
  }
}

module.exports = SpellingBee;
