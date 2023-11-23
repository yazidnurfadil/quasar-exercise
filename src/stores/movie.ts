import { defineStore } from 'pinia';
import { useIndexedDb } from 'src/composables/indexedDb';
import { IMovieRecord, IMovieForm } from 'src/types/anime';
import { optionsGenres } from 'src/utils/constants';

export interface IMovieState {
  selectedMovie: IMovieForm;
  formValid: boolean;
  formMode: 'add' | 'edit';
  movies: IMovieRecord[];
  totalMovies: number;
  metaMovies: {
    page: number;
    limit: number;
    search?: string;
  };
}

type MovieGenreForm = {
  [key: string]: boolean;
};
const { getMovieById, storeMovie, updateMovie, deleteMovie } = useIndexedDb();

export const useMovieStore = defineStore('movie', {
  state: (): IMovieState => {
    const mappedDefaultGenres = Object.keys(optionsGenres).reduce(
      (fixGen, keyGen) => {
        fixGen[keyGen] = false;
        return fixGen;
      },
      {} as MovieGenreForm
    );
    return {
      selectedMovie: {
        title: '',
        director: '',
        summary: '',
        genres: mappedDefaultGenres,
      },
      formValid: false,
      formMode: 'add',
      movies: [],
      totalMovies: 0,
      metaMovies: {
        page: 1,
        limit: 10,
        search: '',
      },
    };
  },
  getters: {
    getMovies: (state) => state.movies,
    isAllDataLoaded: (state) => {
      return state.totalMovies <= state.movies.length;
    },
  },
  actions: {
    async fetch(
      query = { page: 1, limit: 10, search: '' } as {
        page: number;
        limit: number;
        search?: string;
      },
      reset = false
    ) {
      if (reset) {
        this.movies = [];
        this.totalMovies = 0;
        this.metaMovies = query;
      }
      const { getMovie } = useIndexedDb();
      const { page, limit, search } = this.metaMovies;
      const resMovies = await getMovie({ page, limit, search });
      this.totalMovies = resMovies.meta.totalCount;
      const newMovieList = [...this.movies, ...resMovies.data];
      if (newMovieList.length < this.totalMovies) {
        this.metaMovies.page += 1;
      }
      this.movies = newMovieList;
    },
    async retrive(id: number) {
      const res = await getMovieById(id);
      const mappedGenres = Object.keys(optionsGenres).reduce(
        (fixGen, keyGen) => {
          fixGen[keyGen] = res.genres.includes(keyGen);
          return fixGen;
        },
        {} as MovieGenreForm
      );
      const mappedRes = {
        id: res.id,
        title: res.title,
        director: res.director,
        summary: res.summary,
        genres: mappedGenres,
      };
      this.selectedMovie = mappedRes;
      return mappedRes;
    },

    async add() {
      const mappedGenres = Object.keys(this.selectedMovie.genres).filter(
        (key) => this.selectedMovie.genres[key]
      );
      const res = await storeMovie({
        title: this.selectedMovie.title,
        director: this.selectedMovie.director,
        summary: this.selectedMovie.summary,
        genres: mappedGenres,
      });
      return res;
    },

    async update() {
      const mappedGenres = Object.keys(this.selectedMovie.genres).filter(
        (key) => this.selectedMovie.genres[key]
      );
      const res = await updateMovie({
        id: this.selectedMovie.id,
        title: this.selectedMovie.title,
        director: this.selectedMovie.director,
        summary: this.selectedMovie.summary,
        genres: mappedGenres,
      } as IMovieRecord);
      return res;
    },

    async delete() {
      const res = await deleteMovie(Number(this.selectedMovie.id));
      return res;
    },
  },
});
