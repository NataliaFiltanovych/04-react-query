import { useState, type ComponentType } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import css from "./App.module.css";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

const App = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["movies", searchValue, page],
    queryFn: () => fetchMovies(searchValue, page),
    enabled: searchValue !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = (query: string) => {
    setSelectedMovie(null);
    setSearchValue(query);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {data && data.results.length > 0 && (
        <MovieGrid
          movies={data.results}
          onSelect={(movie: Movie) => {
            setSelectedMovie(movie);
          }}
        />
      )}

      {selectMovie && (
        <MovieModal
          movie={selectMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      <Toaster />
    </div>
  );
};

// function App() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [selectMovie, setSelectMovie] = useState<Movie | null>(null);
//   const handlerSearch = async (value: string) => {
//     try {
//       setIsError(false);
//       setIsLoading(true);
//       setMovies([]);
//       const res = await fetchMovies(value);
//       if (res) {
//         setMovies(res);
//       } else {
//         toast.error("No movies found for your request.");
//       }
//     } catch {
//       setIsError(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className={styles.app}>
//       <SearchBar onSubmit={handlerSearch} />

//       {isLoading && <Loader />}
//       {isError && <ErrorMessage />}

//       <MovieGrid
//         movies={movies}
//         onSelect={(movie: Movie) => {
//           setSelectMovie(movie);
//         }}
//       />

//       {selectMovie && (
//         <MovieModal movie={selectMovie} onClose={() => setSelectMovie(null)} />
//       )}
//       <Toaster />
//     </div>
//   );
// }

export default App;
