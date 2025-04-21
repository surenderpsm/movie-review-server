import express from 'express';
import { search, getDetails } from '../controllers/movieController.js';

const router = express.Router();

router.get('/search', search);
router.get('/:imdbID', getDetails);

export default router;
