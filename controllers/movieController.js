import { searchMovies, getMovieDetails } from '../services/omdbService.js';

// GET /api/movies/search?q=batman
export const search = async (req, res) => {
  try {
    const data = await searchMovies(req.query.q);
    if (data.Response === 'False') return res.status(404).json({ error: data.Error });
    res.json(data.Search);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/movies/:imdbID
export const getDetails = async (req, res) => {
  try {
    const data = await getMovieDetails(req.params.imdbID);
    if (data.Response === 'False') return res.status(404).json({ error: data.Error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
