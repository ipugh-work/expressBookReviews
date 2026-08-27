const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {

        if (!isValid(username)) {

            users.push({
                username: username,
                password: password
            });

            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });

        } else {

            return res.status(404).json({
                message: "User already exists!"
            });
        }
    }

    return res.status(404).json({
        message: "Unable to register user."
    });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error("Error getting books:", error.message);
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null, 4));
});
  // Task 11
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error("Error getting book by ISBN:", error.message);
    }
}
// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    let author = req.params.author;
    let bookKeys = Object.keys(books);
    let result = [];

    bookKeys.forEach(function(key) {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    });

    res.send(JSON.stringify(result, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    let title = req.params.title;
    let bookKeys = Object.keys(books);
    let result = [];

    bookKeys.forEach(function(key) {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    });

    res.send(JSON.stringify(result, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
