import axios from 'axios';

const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export const searchMovies = async (query) => {
  const res = await axios.get(OMDB_BASE_URL, {
    params: {
      s: query,
      apikey: process.env.OMDB_API_KEY,
    },
  });
  return res.data;
};

export const getMovieDetails = async (imdbID) => {
  const res = await axios.get(OMDB_BASE_URL, {
    params: {
      i: imdbID,
      plot: 'full',
      apikey: process.env.OMDB_API_KEY,
    },
  });
  return res.data;
};
