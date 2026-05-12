import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import styles from "./App.module.css";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectMovie, setSelectMovie] = useState<Movie | null>(null);
  const handlerSearch = async (value: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      setMovies([]);
      const res = await fetchMovies(value);
      if (res) {
        setMovies(res);
      } else {
        toast.error("No movies found for your request.");
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handlerSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      <MovieGrid
        movies={movies}
        onSelect={(movie: Movie) => {
          setSelectMovie(movie);
        }}
      />

      {selectMovie && (
        <MovieModal movie={selectMovie} onClose={() => setSelectMovie(null)} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
