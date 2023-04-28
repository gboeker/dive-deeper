import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import './db.mjs';
import { fileURLToPath } from 'url';



import sanitize from 'mongo-sanitize';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import url from 'url';
import {startAuthenticatedSession, endAuthenticatedSession} from './auth.mjs';



const Cards = mongoose.model('Cards');
const Decks = mongoose.model('Decks');
const User = mongoose.model('User');


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public'))); //
app.set('view engine', 'hbs'); //
app.use(express.urlencoded({extended: false})); //


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));



const authRequired = (req, res, next) => {
  if(!req.session.user) {
    req.session.redirectPath = req.path;
    res.redirect('/login'); 
  } else {
    next();
  }
};

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});


app.get('/register', (req, res) => {
  res.render('register');
});



app.post('/register', async (req, res) => {
  const username = sanitize(req.body.username);
  const password = sanitize(req.body.password);
  const email = sanitize(req.body.email);
  try {
    //determine if the submitted username already exists
    const user = await User.findOne({username});
    if(user){
      // if the user already exists, re-render the registration form with an error message
      res.render('register', {message: 'username taken'});
      return;
    }

    // if the user does not exist yet:
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    // save the new user and password hash to the database 
    const newUser = new User({username: username, password: hash, email: email});
    await newUser.save();
    const session = await startAuthenticatedSession(req,newUser);

    newUser.save()
    res.redirect('/');

  } catch (err) {
    if(err instanceof mongoose.Error.ValidationError) {
      res.render('register', {message: err.message});
    } else {
      throw err;
    }
  }
});

        
app.post('/logout', async (req, res) => {
  await endAuthenticatedSession(req);
  res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
  const username = sanitize(req.body.username);
  const password = sanitize(req.body.password);

  try {
    //determine if the submitted username exists
    const user = await User.findOne({username});

    // if the user isn't found or if the user is found, but the hash does not match the result of hashing and salting the incoming password:
    if(!user){
      // re-render the login form with an error message
      res.render('login', {message: 'incorrect username'});
      return;
    }

    // determine if the password hash from the existing user matches the result of hashing and salting the incoming password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
      // re-render the login form with an error message
      res.render('login', {message: 'incorrect password'});
      return;
    }

    const session = await startAuthenticatedSession(req,user);
    res.redirect('/');


  } catch (err) {
    if(err instanceof mongoose.Error.ValidationError) {
      res.render('login', {message: err.message});
    } else {
      throw err;
    }
  }
});

app.get('/restricted', authRequired, (req, res) => {
  let message = '<span class="error">this page is not 4 u (plz <a href="login">login</a> first)</span>';
  if(req.session.user) {
      message = '<span class="success">you are logged in, so you can see secret stuff</span>';
      res.render('restricted', {message: message});
  } else {
      res.redirect('login'); 
  } 
});

app.get('/', async (req, res) => {
  res.redirect('/deck');
});

//create new deck
app.get('/deck/create', authRequired, (req, res) => {
  res.render("addDeck");
})


app.post('/deck/create', authRequired, async (req, res) => {
  const d = new Decks({
    name: req.body.name,
    userId: req.session.user._id,
    isPublic: false 
  });

  try {
    await d.save();
    res.redirect('/deck'); 
  } catch (err) {
    if(err instanceof mongoose.Error.ValidationError) {
      res.render('addDeck', {message: err.message});
    } else {
      throw err;
    }
  }
})

//show all created decks
app.get('/deck', authRequired, async (req, res) => {
  const decksFound = await Decks.find({
    $or: [
      {userId: req.session.user._id},
      { isPublic: true }
    ]
  }).populate('cards');

  res.render('decks', {decksFound});
})


// show one specific deck and its cards
app.get('/deck/:slug', authRequired, (req, res) => {
  const deckSlug = req.params.slug; 
  Decks.findOne({ name: deckSlug, $or: [ {isPublic: true}, {userId: req.session.user._id} ]})
    .populate('cards')
    .then(foundDeck => {
      if (!foundDeck) {
        return res.status(404).send('Deck not found');
      }
      const showDeleteButton = !foundDeck.isPublic;
      res.render('cardsTable', { deck: foundDeck, deckSlug/*, showDeleteButton */}); //foundCards
    })
    .catch(() => res.status(500).send('Server error'));
});


app.get('/deck/:slug/addCard', authRequired, (req, res) => {
  const deckSlug = req.params.slug;
  res.render("addCard", {deckSlug});
});


app.post('/deck/:slug/addCard', authRequired, (req, res) => {
  const deckSlug = req.params.slug;
  const c = new Cards({
    question: req.body.question

  });
  c.save()
    .then(savedCard => {
      return Decks.updateOne(
        {name: deckSlug, $or: [ {isPublic: true}, {userId: req.session.user._id} ]},
        {$push: {cards: savedCard}},
        {new: true}
      );
    })
    .then(() => {
      res.redirect(`/deck/${deckSlug}`)
    })
    .catch(() => res.status(500).send('server error'));
});


app.post('/deck/:slug/delete', authRequired, async (req, res) => {
  const deckSlug = req.params.slug;
  try {
    const deletedDeck = await Decks.findOneAndDelete({ name: deckSlug, userId: req.session.user._id })
      .populate('cards')
      .exec();

    if (!deletedDeck) {
      return res.status(404).send('Deck not found');
    }

    // Delete all cards associated with the deleted deck
    const deletedCards = await Cards.deleteMany({ _id: { $in: deletedDeck.cards } });

    res.redirect('/deck');
  } catch (err) {
    res.status(500).send('Server error');
  }
});


app.listen(process.env.PORT ?? 3000);





