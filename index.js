const express = require('express');
const bodyParser = require('body-parser');
const SpellingBee = require('./spelling-bee');
const ENGLISH_WORDLIST = require('wordlist-english');

const ENGLISH_DIALECTS = ['english', 'english/american', 'english/australian', 'english/british', 'english/canadian'];

function createServices() {
  return {
    spellingBee: new SpellingBee(ENGLISH_WORDLIST, ENGLISH_DIALECTS)
  };
}

function createServer(services) {
  const app = express();

  app.set('view engine', 'pug');

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  app.get('/bee', (_req, res) => {
    res.render('bee', { input: {
        letters: '',
        mustContain: '',
        length: '',
        startsWith: ''
      }
    });
  });

  app.post('/bee', (req, res) => {
    const {letters, mustContain, length, startsWith} = req.body;

    const sanitizedLetters = letters.trim().toLowerCase();
    const sanitizedMustContain = mustContain.trim().toLowerCase();
    const sanitizedLength = length.trim();
    const sanitizedStartsWith = startsWith.trim().toLowerCase();

    const results = services.spellingBee.searchAll(
      sanitizedLetters.split(''),
      sanitizedMustContain,
      parseInt(sanitizedLength),
      sanitizedStartsWith
    );

    res.render('bee', {
      results, input: {
        letters: sanitizedLetters,
        mustContain: sanitizedMustContain,
        length: sanitizedLength,
        startsWith: sanitizedStartsWith
      }
    });
  });

  return app;
}

const services = createServices();
const server = createServer(services);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('listening on port', port);
});
