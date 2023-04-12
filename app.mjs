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
  const query = {};
  const foundQuestions = req.query.question;
  if(foundQuestions){
    query.question = foundQuestions;
  }
  Cards.find(query) 
    .then(foundCards => {
      res.render('table', {foundCards});
    })
    .catch(() => res.status(500).send('server error'));
      
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

//show one specific deck 
// app.get('/deck/slug')
  

app.get('/cards/add', (req, res) => {
  res.render("addCard");
});

app.post('/cards/add', (req, res) => {
  const c = new Cards({
    question: req.body.question
  });
  c.save()
    .then(() => res.redirect('/'))
    .catch(() => res.status(500).send('server error'));
  
});


app.listen(process.env.PORT ?? 3000);


