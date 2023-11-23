export interface IMovie {
  title: string;
  director: string;
  summary: string;
  genres: string[];
}

export interface IMovieRecord extends IMovie {
  id: number;
}

export interface IMovieForm extends Omit<IMovie, 'genres'> {
  id?: number;
  genres: { [key: string]: boolean };
}
