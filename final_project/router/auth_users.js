const express = require('express');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username && username.length > 0;
};

const authenticatedUser = (username, password) => {
  let validUsers = users.filter(user =>
    user.username === username && user.password === password
  );
  return validUsers.length > 0;
};

// REGISTER
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.json({ message: "User successfully registered" });
});

// LOGIN
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (authenticatedUser(username, password)) {
    req.session.user = username;
    return res.json({ message: "Customer successfully logged in" });
  }

  return res.status(401).json({ message: "Invalid login" });
});

// ADD REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  books[isbn].reviews[req.session.user] = review;

  return res.json({
    message: "Review added successfully",
    reviews: books[isbn].reviews
  });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.user;

    if (books[isbn]) {
        delete books[isbn].reviews[username];
        return res.json({ message: "Review deleted successfully" });
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;