import express from 'express';
import {
  createReview,
  getReviewsByMovie,
  getReviewsByUser,
  deleteReview, getMovieReviewSummary, voteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/movie/:imdbID', getReviewsByMovie);
router.get('/user/:userId', getReviewsByUser);
router.delete('/:id', protect, deleteReview);
router.get('/summary/:imdbID', getMovieReviewSummary);
router.post('/vote/:id', protect, voteReview);

export default router;
