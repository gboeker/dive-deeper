import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import './db.mjs';
import { fileURLToPath } from 'url';
const Cards = mongoose.model('Cards');
const Decks = mongoose.model('Decks');

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public'))); //

app.set('view engine', 'hbs'); //

app.use(express.urlencoded({extended: false})); //


app.get('/', (req, res) => {
  res.redirect('/deck');
});

//create new deck
app.get('/deck/create', (req, res) => {
  res.render("addDeck");
})

app.post('/deck/create', (req, res) => {
  const d = new Decks({
    name: req.body.name
  });
  d.save()
    .then(() => res.redirect('/deck'))
    .catch(() => res.status(500).send('server error'));
})

//show all created decks
app.get('/deck', (req, res) => {
  const query = {};
  const foundDecks = req.query.name;
  if(foundDecks){
    query.name = foundDecks;
  }
  Decks.find(query) 
    .then(decksFound => {
      res.render('decks', {decksFound});
    })
    .catch(() => res.status(500).send('server error'));
})

// show one specific deck and its cards
app.get('/deck/:slug', (req, res) => {
  const deckSlug = req.params.slug; 
  Decks.findOne({ name: deckSlug })
    .populate('cards')
    .then(foundDeck => {
      if (!foundDeck) {
        return res.status(404).send('Deck not found');
      }
      res.render('cardsTable', { deck: foundDeck, deckSlug }); //foundCards
    })
    .catch(() => res.status(500).send('Server error'));
});


app.get('/deck/:slug/addCard', (req, res) => {
  const deckSlug = req.params.slug;
  res.render("addCard", {deckSlug});
});


app.post('/deck/:slug/addCard', (req, res) => {
  const deckSlug = req.params.slug;
  const c = new Cards({
    question: req.body.question
  });
  c.save()
    .then(savedCard => {
      return Decks.updateOne(
        {name: deckSlug},
        {$push: {cards: savedCard}},
        {new: true}
      );
    })
    .then(() => {
      res.redirect(`/deck/${deckSlug}`)
    })
    .catch(() => res.status(500).send('server error'));
});

// app.get('/deck/:slug/delete', (req, res) => {
//   res.redirect('/deck');
// })

app.post('/deck/:slug/delete', (req, res) => {
  const deckSlug = req.params.slug; 
  Decks.findOneAndDelete({ name: deckSlug })
    .then(deletedDeck => {
      if (!deletedDeck) {
        return res.status(404).send('Deck not found');
      }
      res.redirect('/deck');
    })
    .catch(() => res.status(500).send('Server error'));
})

app.listen(process.env.PORT ?? 3000);


