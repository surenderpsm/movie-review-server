import User from '../models/User.js';
import Review from '../models/Review.js';


// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get public profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: 'User not found' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // block password change here
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Follow user
export const followUser = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const target = await User.findById(req.params.id);

    if (!me.following.includes(target._id)) {
      me.following.push(target._id);
      target.followers.push(me._id);
      await me.save();
      await target.save();
    }

    res.json({ message: 'Followed user' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const target = await User.findById(req.params.id);

    me.following = me.following.filter(f => f.toString() !== target._id.toString());
    target.followers = target.followers.filter(f => f.toString() !== me._id.toString());

    await me.save();
    await target.save();

    res.json({ message: 'Unfollowed user' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Route for logged-in users: fetch reviews from people they follow
export const getFeedForLoggedInUser = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);

    const feed = await Review.find({ user: { $in: me.following } })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'username');

    res.json(feed);
  } catch (err) {
    console.error('[getFeedForLoggedInUser]', err);
    res.status(500).json({ error: err.message });
  }
};

// Route for anonymous users: fetch all reviews
export const getFeedForAnonymousUser = async (req, res) => {
  try {
    const feed = await Review.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'username');

    res.json(feed);
  } catch (err) {
    console.error('[getFeedForAnonymousUser]', err);
    res.status(500).json({ error: err.message });
  }
};

export const updatePreferredGenres = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
        req.user.id,
        { preferredGenres: req.body.genres },
        { new: true }
    );
    res.json({ message: 'Genres updated', preferredGenres: user.preferredGenres });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { imdbID, title, poster } = req.body;

    const exists = user.favorites.find((fav) => fav.imdbID === imdbID);

    if (exists) {
      user.favorites = user.favorites.filter((fav) => fav.imdbID !== imdbID);
    } else {
      user.favorites.push({ imdbID, title, poster });
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('username'); // Return only public fields

    res.json(users);
  } catch (err) {
    console.error('[searchUsers]', err);
    res.status(500).json({ error: err.message });
  }
};

