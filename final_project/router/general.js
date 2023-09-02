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

// Task 10
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await getBooks();
        if (allBooks && allBooks.length > 0) {
            return res.status(200).json(allBooks);
        } else {
            return res.status(404).json({message: "No books found!"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error fetching books!"});
    }
});

// Task 11
public_users.get('/:number', async (req, res) => {
    let number = req.params.number;
    try {
        const book = await getBookByISBN(number);
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({message: "Book not found!"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error fetching book details!"});
    }
});

// Task 12
public_users.get('/author/:author', async (req, res) => {
    let authorName = req.params.author;
    try {
        const booksByAuthor = await getBooksByAuthor(authorName);
        if (booksByAuthor && booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({message: "No books found by the specified author!"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error fetching books by author!"});
    }
});

// Task 13
public_users.get('/title/:title', async (req, res) => {
    let bookTitle = req.params.title;
    try {
        const booksByTitle = await getBooksByTitle(bookTitle);
        if (booksByTitle && booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({message: "No books found with the specified title!"});
        }
    } catch (error) {
        return res.status(500).json({message: "Error fetching books by title!"});
    }
});

function getBooks() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Object.values(books));
        }, 100); 
    });
}

function getBookByISBN(isbn) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books[isbn]);
        }, 100);
    });
}

function getBooksByAuthor(authorName) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredBooks = Object.values(books).filter(book => book.author === authorName);
            resolve(filteredBooks);
        }, 100); 
    });
}

function getBooksByTitle(bookTitle) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filteredBooks = Object.values(books).filter(book => book.title === bookTitle);
            resolve(filteredBooks);
        }, 100);  
    });
}

module.exports.general = public_users;
