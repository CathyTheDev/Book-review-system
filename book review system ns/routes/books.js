const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Review = require('../models/review');
const authMiddleware = require('../middleware/auth');

//  (Add a new book, authenticated)
router.post('/', authMiddleware, async (req, res) => {
  const { title, author, genre } = req.body;
  if (!title || !author || !genre) {
    return res.status(400).json({ message: 'Title, author, and genre are required' });
  }

  try {
    const book = new Book({ title, author, genre });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error });
  }
});

//  (Get all books with pagination and filters)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  const query = {};
  if (author) query.author = author;
  if (genre) query.genre = genre;

  try {
    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Book.countDocuments(query);
    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

//  (Get book details with average rating and reviews)
router.get('/:id', async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const reviews = await Review.find({ bookId: req.params.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username')
      .exec();

    const totalReviews = await Review.countDocuments({ bookId: req.params.id });
    const averageRating = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(req.params.id) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    res.json({
      book,
      averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0,
      reviews,
      totalReviewPages: Math.ceil(totalReviews / limit),
      currentReviewPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details', error });
  }
});

module.exports = router;