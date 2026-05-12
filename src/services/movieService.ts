import axios from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.baseURL = "https://api.themoviedb.org/3/search/";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

interface Results {
  results: Movie[];
}
export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<Results>(`movie?query=${query}`);

  return response.data.results;
};
