import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import './db.mjs';
import { fileURLToPath } from 'url';
const Deck = mongoose.model('Deck');

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public'))); //

app.set('view engine', 'hbs'); //

app.use(express.urlencoded({extended: false})); //



// app.get('/', (req, res) => {
//     res.render('addCard');
// });
  
// app.post('/', (req, res) => {
//     const d = new Deck({
//         question: req.body.question
//     });
//     d.save()
//         .then(() => res.redirect('/'))
//         .catch(() => res.status(500).send('server error'));
  
// });

app.get('/', (req, res) => {
    const query = {};
    const foundQuestions = req.query.question;
    if(foundQuestions){
      query.question = foundQuestions;
    }
    Deck.find(query) 
      .then(foundCards => {
        res.render('table', {foundCards});
      })
      .catch(() => res.status(500).send('server error'));
      
});
  
  
  
app.get('/cards/add', (req, res) => {
    res.render("addCard");
  });

app.post('/cards/add', (req, res) => {
    const d = new Deck({
        question: req.body.question
    });
    d.save()
        .then(() => res.redirect('/'))
        .catch(() => res.status(500).send('server error'));
  
});


app.listen(process.env.PORT ?? 3000);


