import axios from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

interface Results {
  results: Movie[];
  total_pages: number;
}
export const fetchMovies = async (
  query: string,
  page: number
): Promise<Results> => {
  const res = await axios.get<Results>(BASE_URL, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
