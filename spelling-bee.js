

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
}


// const bee = new SpellingBee(ENGLISH_WORDLIST);
//
// const result = bee.searchAll(['y','a','b','l','o','r','t'], 'y',6, 'ta');
//
// console.log(result)

module.exports = SpellingBee;
