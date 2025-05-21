const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Book = require('../models/book');
const authMiddleware = require('../middleware/auth');

// POST /books/:id/reviews (Submit a review, authenticated)
router.post('/books/:id/reviews', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating (1-5) and comment are required' });
  }

  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = new Review({
      bookId: req.params.id,
      userId: req.user.id,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    res.status(500).json({ message: 'Error submitting review', error });
  }
});

// PUT /reviews/:id (Update your own review)
router.put('/:id', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating (1-5) and comment are required' });
  }

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
});

// DELETE /reviews/:id (Delete your own review)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
});

module.exports = router;