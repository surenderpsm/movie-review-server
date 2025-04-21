import Review from '../models/Review.js';

// Create a review
export const createReview = async (req, res) => {
  try {
    const { imdbID, title, content, rating } = req.body;
    const review = await Review.create({
      imdbID,
      title,
      content,
      rating,
      user: req.user.id
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get reviews for a movie
export const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ imdbID: req.params.imdbID }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews by a user
export const getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMovieReviewSummary = async (req, res) => {
  try {
    const { imdbID } = req.params;

    const reviews = await Review.find({ imdbID }).populate('user', 'username');

    const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    const topReviews = [...reviews].sort((a, b) => {
      const aScore = (a.helpful?.length || 0) - (a.unhelpful?.length || 0);
      const bScore = (b.helpful?.length || 0) - (b.unhelpful?.length || 0);
      return bScore - aScore;
    }).slice(0, 5); // top 5

    res.json({ avgRating, reviews: topReviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const voteReview = async (req, res) => {
  try {
    const { vote } = req.body; // 'helpful' or 'unhelpful'
    const userId = req.user.id;
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ error: 'Review not found' });

    // Remove from both arrays first
    review.helpful = review.helpful.filter(id => id.toString() !== userId);
    review.unhelpful = review.unhelpful.filter(id => id.toString() !== userId);

    if (vote === 'helpful') review.helpful.push(userId);
    else if (vote === 'unhelpful') review.unhelpful.push(userId);

    await review.save();
    res.json({ message: 'Vote recorded', helpful: review.helpful.length, unhelpful: review.unhelpful.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
