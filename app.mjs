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



app.get('/', (req, res) => {
    res.render('addCard');
});
  
app.post('/', (req, res) => {
    const d = new Deck({
        question: req.body.question
    });
    d.save()
        .then(() => res.redirect('/'))
        .catch(() => res.status(500).send('server error'));
  
});


app.listen(process.env.PORT ?? 3000);


