
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./Models/book.js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});


app.get('/books', getBooks)
app.post('/books', postBooks)
app.delete('/books/:id', deleteBooks)

async function getBooks(req, res) {
  let queryObj = {};
  console.log('inside get')
  if (req.query.email) {
    queryObj = {email: req.query.email}
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

async function postBooks(req, res) {
  try {
    let newBook = await Book.create(req.body);
    res.status(201).send(newBook);
  } catch (event) {
    res.status(500).send('Books was not added');
  }
}

async function deleteBooks(req, res) {
  const id = req.params.id;
  console.log('inside delete')
  try{
    const deletedBook = await Book.findByIdAndDelete(id);
    console.log(deletedBook);
    if(deletedBook) {
      res.status(204).send('BOOK DELETED');
    } else {
      res.status(404).send("BOOK NOT FOUND");
    }
  } catch (event) {
    res.status(500).send('SERVER ERROR');
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
