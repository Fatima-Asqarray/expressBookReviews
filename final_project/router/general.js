const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

const public_users = express.Router();

/* ---------------- REGISTER (optionnel) ---------------- */
public_users.post("/register", (req, res) => {
  return res.json({ message: "Use /customer/register" });
});

/* ---------------- GET ALL BOOKS ---------------- */
public_users.get('/', function (req, res) {
  return res.json(books);
});

/* ---------------- GET BY ISBN ---------------- */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn]);
});

/* ---------------- GET BY AUTHOR ---------------- */
public_users.get('/author/:author', function (req, res) {
  let result = [];

  for (let key in books) {
    if (books[key].author === req.params.author) {
      result.push(books[key]);
    }
  }

  return res.json(result);
});

/* ---------------- GET BY TITLE ---------------- */
public_users.get('/title/:title', function (req, res) {
  let result = [];

  for (let key in books) {
    if (books[key].title === req.params.title) {
      result.push(books[key]);
    }
  }

  return res.json(result);
});

/* ---------------- GET REVIEWS ---------------- */
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.json(books[isbn].reviews);
});

/* ---------------- ASYNC AXIOS (TÂCHE 11) ---------------- */
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports.general = public_users;