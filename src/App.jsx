import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/search";
import { fetchMovies } from "./services/tmdb";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import useDebounce from "./hooks/useDebounce";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const getMovies = async (query = "") => {
      setIsLoading(true); // Mulai loading
      setErrorMessage(""); // Reset error

      await fetchMovies(
        (data) => setMovies(data || []),
        // Pastikan data ada
        setErrorMessage,
        query
      );

      setIsLoading(false); // Selesai loading
    };

    getMovies(debounceSearch);
  }, [debounceSearch]);

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     const getMovies = async (query = "") => {
  //       setIsLoading(true);
  //       setErrorMessage("");

  //       await fetchMovies(
  //         (data) => setMovies(data || []),
  //         setErrorMessage,
  //         query
  //       );

  //       setIsLoading(false);
  //     };

  //     getMovies(searchTerm);
  //   }, 500); // ⏳ delay 500ms

  //   // 🔁 Membersihkan timeout saat searchTerm berubah sebelum 500ms selesai
  //   return () => clearTimeout(delayDebounce);
  // }, [searchTerm]);
  console.log(movies);
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
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
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
