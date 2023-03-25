import express from 'express'
// import mongoose from 'mongoose';
import path from 'path'
// import './db.mjs';
import { fileURLToPath } from 'url';
// const Deck = mongoose.model('Deck');

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public'))); //

app.set('view enginer', 'hbs'); //

app.use(express.urlencoded({extended: false})); //

app.listen(process.env.PORT || 3000);
