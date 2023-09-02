const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // Check if the required fields are provided
    if (!username || !password) {
        return res.status(400).json({message: "Username and/or password not provided!"});
    }

    // Check if the user already exists
    if (users[username]) {
        return res.status(409).json({message: "Username already exists!"});
    }

    // If the user doesn't exist, add them to the users object
    users[username] = password;
    
    return res.status(201).json({message: "User successfully registered!"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    if (Object.keys(books).length > 0) {
      let formattedBooks = Object.values(books).map(book => ({
        "Author": book.author,
        "Title": book.title,
        "Reviews": book.reviews
      }));
  
      return res.status(200).json(formattedBooks);
    } else {
      return res.status(404).json({message: "No books found!"});
    }
  });
    

// Get book details based on ISBN
public_users.get('/:number',function (req, res) {
    // Retrieve the number from the request parameters
    let number = req.params.number;

    // Check if the book with the given number exists
    if (books[number]) {
        let book = books[number];
        let formattedBook = {
            "Author": book.author,
            "Title": book.title,
            "Reviews": book.reviews
        };

        return res.status(200).json(formattedBook);
    } else {
        return res.status(404).json({message: "Book not found!"});
    }
});


  
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Retrieve the author from the request parameters
    let authorName = req.params.author;

    // Create an array to store books by the specified author
    let booksByAuthor = [];

    // Iterate over the books database and find books by the specified author
    for (let number in books) {
        if (books[number].author === authorName) {
            let book = books[number];
            let formattedBook = {
                "Author": book.author,
                "Title": book.title,
                "Reviews": book.reviews
            };
            booksByAuthor.push(formattedBook);
        }
    }

    // Check if we found any books by the specified author
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by the specified author!" });
    }
});



// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Retrieve the title from the request parameters
    let bookTitle = req.params.title;

    // Create an array to store books with the specified title
    let booksByTitle = [];

    // Iterate over the books database and find books by the specified title
    for (let number in books) {
        if (books[number].title === bookTitle) {
            let book = books[number];
            let formattedBook = {
                "Author": book.author,
                "Title": book.title,
                "Reviews": book.reviews
            };
            booksByTitle.push(formattedBook);
        }
    }

    // Check if we found any books with the specified title
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with the specified title!" });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    let isbn = req.params.isbn;

    // Check if the book with the provided ISBN exists
    if (books[isbn]) {
        // Return the reviews of the specified book
        return res.status(200).json(books[isbn].reviews);
    } else {
        // If the book with the specified ISBN doesn't exist
        return res.status(404).json({ message: "No book found with the specified ISBN!" });
    }
});

function fetchDataAsync(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
}

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', (req, res) => {
    fetchDataAsync(books)
        .then(data => {
            if (Object.keys(data).length > 0) {
                let formattedBooks = Object.values(data).map(book => ({
                    "Author": book.author,
                    "Title": book.title,
                    "Reviews": book.reviews
                }));
                res.status(200).json(formattedBooks);
            } else {
                res.status(404).json({ message: "No books found!" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/:number', (req, res) => {
    fetchDataAsync(books)
        .then(data => {
            if (data[req.params.number]) {
                let book = data[req.params.number];
                let formattedBook = {
                    "Author": book.author,
                    "Title": book.title,
                    "Reviews": book.reviews
                };
                res.status(200).json(formattedBook);
            } else {
                res.status(404).json({ message: "Book not found!" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// Task 12: Get book details based on Author using Promises
public_users.get('/author/:author', (req, res) => {
    fetchDataAsync(books)
        .then(data => {
            let booksByAuthor = Object.values(data).filter(book => book.author === req.params.author)
                .map(book => ({
                    "Author": book.author,
                    "Title": book.title,
                    "Reviews": book.reviews
                }));
            if (booksByAuthor.length > 0) {
                res.status(200).json(booksByAuthor);
            } else {
                res.status(404).json({ message: "No books found by the specified author!" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', (req, res) => {
    fetchDataAsync(books)
        .then(data => {
            let booksByTitle = Object.values(data).filter(book => book.title === req.params.title)
                .map(book => ({
                    "Author": book.author,
                    "Title": book.title,
                    "Reviews": book.reviews
                }));
            if (booksByTitle.length > 0) {
                res.status(200).json(booksByTitle);
            } else {
                res.status(404).json({ message: "No books found with the specified title!" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Internal Server Error" });
        });
});

module.exports.general = public_users;
