'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./Models/book.js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/', (req,res) => res.send('hello'));
app.get('/books', getBooks);
app.post('/books', postBooks);
app.delete('/books/:id', deleteBooks);
app.put('/books/:id', putBooks);

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});

async function getBooks(req, res) {
  
  const email = req.query.email;
  try {
    let booksFromDB = await Book.find({email});
    if (booksFromDB) {
      res.status(200).send(booksFromDB);
    } else {
      res.status(404).send('No Books Found');
    }
  } catch(e) {
    console.log(e);
    res.status(500).send('server error');
  }
}

async function postBooks(req, res) {
  const newBook = {...req.body, email: req.query.email};

  try {
    let createBook = await Book.create(newBook);
    if(createBook) {
      res.status(201).send(createBook);
    } else {
      res.status(400).send('BOOK NOT ADDED')
    }
  } catch(e) {
    console.log(e);
    res.status(500).send('SERVER ERROR');
  }
}

async function deleteBooks(req, res) {
  const id = req.params.id;
  const email = req.query.email;
  try{
    const book = await Book.findOne({_id: id, email: email });
    if(!book) {
      res.status(400).send('BOOK NOT DELETED');
    } else {
      await Book.findByIdAndDelete(id);
      res.status(204).send('BOOK DELETED');
    }
  } catch(e) {
    console.log(e)
    res.status(500).send('SERVER ERROR');
  }
}

async function putBooks(req, res) {
  const id = req.params.id;
  const updatedData = {...req.body, email: req.query.email }
  console.log(updatedData);
  try{
    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {new: true, overwrite: true});
    console.log(updatedBook);
    res.status(200).send(updatedBook)
  } catch (e) {
    console.log(e);
    res.status(500).send('SERVER ERROR');
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
