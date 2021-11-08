const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./Models/book.js');


async function seed() {
    mongoose.connect(process.env.DB_URL);

    const myBook = new Book ({
        title: 'Tale of Two Cities',
        description: 'Story about a french doctor and his 18 year imprisonment',
        status: false,
        email: 'kland13@gmail.com',
    });
    await myBook.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Book is saved, Tale of Two Cites')
        }
    })

    await Book.create({
        title: 'The Alchemist',
        description: 'Story of a shepard boy in search of a worldy treasure',
        status: false,
        email: 'emfierro2@gmail.com',
    });
    console.log('Book is saved, The Alchemist');

    await Book.create({
        title:'The Little Prince',
        description:'A young prince that visits various planets',
        status: false,
        email: 'kland13@gmail.com'
    })
    console.log('Book is saved, The Little Prince');

    mongoose.disconnect();
}

seed();