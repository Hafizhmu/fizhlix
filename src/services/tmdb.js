import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

// Fungsi untuk mencari film
export const searchMovies = async (query, setErrorMessage) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
      API_OPTIONS
    );
    const data = await response.json();
    return data;
  } catch (error) {
    setErrorMessage(error.message);
    return null;
  }
};

export const fetchMovies = async (callback, setErrorMessage) => {
  try {
    const endpoint = `${BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const response = await axios.get(endpoint, API_OPTIONS);

    // response.data akan berisi seluruh data dari API
    callback(response.data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
    if (setErrorMessage) {
      if (error.response) {
        // Error dari server (HTTP 4xx/5xx)
        setErrorMessage(error.response.data.status_message || "Server Error");
      } else if (error.request) {
        // Tidak ada respon
        setErrorMessage("No response from server");
      } else {
        // Error dalam membuat request
        setErrorMessage(error.message || "Request error");
      }
    }
    return null;
  }
};

// Fungsi lain bisa ditambahkan di sini, misalnya: getMovieDetail, getTrending, dsb.
