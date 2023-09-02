const express = require('express');
const jwt = require('jsonwebtoken');

const regd_users = express.Router(); 

let users = [
  {username: 'johnDoe', password: '123456'}
];

const authenticatedUser = (username, password) => {
  return users.find(u => u.username === username && u.password === password);
}

// Login route 
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(400).json({message: 'Username and password required'});
  }

  const user = authenticatedUser(username, password);

  if(!user) {
    return res.status(401).json({message: 'Invalid credentials'});
  }

  const token = jwt.sign({sub: user.username}, 'secretkey');

  req.session.user = {
    username: user.username,
    token    
  }

  return res.json({message: 'Logged in successfully!'});

});

// Add/update review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  const username = req.session.user.username;

  // Find book and update review
  books[isbn].reviews.push({
    user: username,
    text: reviewText 
  });

  res.json({message: 'Review added successfully!'});

});


// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.user.username;

  books[isbn].reviews = books[isbn].reviews.filter(r => r.user !== username);

  res.json({message: 'Review deleted successfully!'});
});

module.exports = {
  authenticated: regd_users
};
