import express from 'express';
import {
  getMe,
  getProfile,
  updateProfile,
  followUser,
  unfollowUser,
  updatePreferredGenres,
  toggleFavorite,
  searchUsers,
  getFeedForLoggedInUser,
  getFeedForAnonymousUser,
  updateUsername,
  updatePassword
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/feed', protect, getFeedForLoggedInUser);
router.get('/feed/all', getFeedForAnonymousUser);
router.get('/me', protect, getMe);
router.get('/search', searchUsers);
router.get('/:id', getProfile);
router.put('/me', protect, updateProfile);
router.put('/genres', protect, updatePreferredGenres);
// New routes for username and password updates
router.put('/username', protect, updateUsername);
router.put('/password', protect, updatePassword);
router.post('/favorites', protect, toggleFavorite);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);


export default router;
