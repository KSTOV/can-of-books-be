
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./Models/book.js');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});


app.get('/books', getBooks)
app.get('/test', (req, res) => {

  res.send('test request received')

})

async function getBooks(req, res) {
  let queryObj = {};

  if (req.query.title) {
    queryObj = {title: req.query.title}
  }

  try {
    let booksFromDB = await Book.find(queryObj);
    if (booksFromDB) {
      res.status(200).send(booksFromDB);
    } else {
      res.status(404).send('No Books Found');
    }
  } catch (event) {
    console.error(event);
    res.status(500).send('server error');
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
