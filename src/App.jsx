import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/search";
import { fetchMovies } from "./services/tmdb";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      setIsLoading(true); // Mulai loading
      setErrorMessage(""); // Reset error

      await fetchMovies((data) => {
        setMovies(data || []); // Pastikan data ada
      }, setErrorMessage);

      setIsLoading(false); // Selesai loading
    };

    getMovies();
  }, []);
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
          <h2>All Movies</h2>
          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map((movie) => (
                <p key={movie.id} className="text-white">
                  {movie.title}
                </p>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
