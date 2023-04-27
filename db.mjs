import mongoose from 'mongoose';

// is the environment variable, NODE_ENV, set to PRODUCTION? 
import fs from 'fs';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
  // if we're in PRODUCTION mode, then read the configration from a file
  // use blocking file io to do this...
  const fn = path.join(__dirname, 'config.json');
  const data = fs.readFileSync(fn);

  // our configuration file will be in json, so parse it and set the
  // conenction string appropriately!
  const conf = JSON.parse(data);
  dbconf = conf.dbconf;
} else {
  // if we're not in PRODUCTION mode, then use
  console.log('not in production mode');
  dbconf = 'mongodb://localhost/finalprojectconfig';
}



const mongooseOpts = {
  useNewUrlParser: true,  
  useUnifiedTopology: true
};

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, minLength: 3, maxLength: 20},
  password: {type: String, required: true, minLength: 8},
  email: {type: String, required: true},
  decks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Decks' }]
});

const Cards = new mongoose.Schema({
  question: String,
  played: Boolean
})

const Decks = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cards' }]
})

mongoose.model('Cards', Cards); //
mongoose.model('Decks', Decks);

mongoose.model('User', UserSchema);



mongoose.connect(dbconf) 
  .catch(error => handleError(error)); //
