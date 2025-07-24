import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/search";
import { fetchMovies } from "./services/tmdb";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import useDebounce from "./hooks/useDebounce";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const debounceSearch = useDebounce(searchTerm, 500);

  //useDebounce(fn() => setDebouncedSearchTerm(searchTerm), 500),[searchTerm]);
  useEffect(() => {
    const getMovies = async (query = "") => {
      setIsLoading(true);
      setErrorMessage("");

      let data = null;

      await fetchMovies(
        (response) => {
          data = response;
          setMovies(response || []);
        },
        setErrorMessage,
        query
      );

      if (data.length > 0 && query.trim() !== "") {
        await updateSearchCount(query, data[0]);
      }

      setIsLoading(false);
    };

    getMovies(debounceSearch);
  }, [debounceSearch]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // useEffect(() => {
  //   const getMovies = async (query = "") => {
  //     setIsLoading(true); // Mulai loading
  //     setErrorMessage(""); // Reset error

  //     await fetchMovies(
  //       (data) => setMovies(data || []),
  //       // Pastikan data ada
  //       setErrorMessage,
  //       query

  //     );
  //     if (query && data.results >0) {
  //       await updateSearchCount(query, data.results[0]);
  //     }

  //     setIsLoading(false); // Selesai loading
  //   };

  //   getMovies(debounceSearch);
  // }, [debounceSearch]);
  // console.log(movies);
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find Your <span className="text-gradient">Movie</span> You'll Enjoy
            in Fizhulix
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner className="flex align-items-center" />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie}></MovieCard>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
