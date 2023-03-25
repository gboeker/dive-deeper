import mongoose from 'mongoose';

const mongooseOpts = {
  useNewUrlParser: true,  
  useUnifiedTopology: true
};


const Deck = new mongoose.Schema({
  Question: String,
  played: Boolean

})


mongoose.model('Deck', Deck); //

mongoose.connect('mongodb://localhost/decksDB') //
  .catch(error => handleError(error)); //
