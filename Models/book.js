'use strict';

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: Boolean,
    email: String
});

const Book =mongoose.model('Books', bookSchema);

module.exports = Book;