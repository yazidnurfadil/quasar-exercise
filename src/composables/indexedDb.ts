import { animeList } from 'src/migrations/anime';
import { IMovie, IMovieRecord } from 'src/types/anime';

let db: IDBDatabase | null = null;

const initDb = () => {
  return new Promise((resolve, reject) => {
    const openRequest = globalThis.indexedDB.open('ZidMovies', 1);
    openRequest.onerror = (e: Event) => {
      console.log('Error opening db', e);
      reject(new Error('Error opening db'));
      // Handle error
    };
    openRequest.onsuccess = (e: Event) => {
      const target = e.target as IDBOpenDBRequest;
      db = target.result;
      resolve(db);
    };
    openRequest.onupgradeneeded = (e: Event) => {
      console.info('Ups! No DB detected, lets create one');
      console.info('Database created');
      const target = e.target as IDBOpenDBRequest;
      db = target.result;

      const objectStore = db.createObjectStore('anime', {
        keyPath: 'id',
        autoIncrement: true,
      });
      objectStore.transaction.oncomplete = () => {
        console.log('Object store "anime" created');
        console.log('Migrating anime data');

        animeList.map((anime) => {
          const transaction = (db as IDBDatabase).transaction(
            'anime',
            'readwrite'
          );
          const objectStore = transaction.objectStore('anime');
          // Add new student
          const request = objectStore.add(anime);
          request.onsuccess = () => {
            // request.result contains key of the added object
            console.log(
              `New anime added, anime: ${anime.title} => id: ${request.result}`
            );
          };
          request.onerror = (err) => {
            console.error(`Error to add new anime: ${err}`);
          };
        });
      };
    };
  });
};

export interface GetMovieOptions {
  limit?: number;
  page?: number;
  search?: string;
}
const getMovie = async (
  { limit = 10, page = 1, search = '' } = {} as GetMovieOptions
): Promise<{ data: IMovieRecord[]; meta: { totalCount: number } }> => {
  return new Promise((resolve, reject) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const limitPage = IDBKeyRange.bound(startIndex, endIndex, true, false);
    const movies: IMovieRecord[] = [];
    let totalData = 0;
    const transaction = (db as IDBDatabase).transaction('anime', 'readonly');
    const objectStore = transaction.objectStore('anime');

    const storeCursor = objectStore.openCursor(limitPage);
    storeCursor.onsuccess = (e: any) => {
      const target = e.target;
      const cursor = target.result as IDBCursorWithValue;
      if (cursor) {
        if (search) {
          if (cursor.value.title.toLowerCase().indexOf(search) > -1) {
            movies.push(cursor.value);
          }
        } else {
          movies.push(cursor.value);
        }
        cursor.continue();
      }
    };
    const storeTotal = objectStore.openCursor();

    storeTotal.onsuccess = function (e: any) {
      const target = e.target;
      const cursor = target.result as IDBCursorWithValue;
      if (cursor) {
        if (search) {
          if (cursor.value.title.toLowerCase().indexOf(search) > -1) {
            totalData += 1;
          }
        } else {
          totalData += 1;
        }
        cursor.continue();
      }
    };
    transaction.oncomplete = () => {
      resolve({ data: movies, meta: { totalCount: totalData } });
    };
    transaction.onerror = (err) => {
      console.error(`Error get anime data: ${err}`);
      reject();
    };
  });
};

const getMovieById = async (id: number): Promise<IMovieRecord> => {
  return new Promise((resolve, reject) => {
    const transaction = (db as IDBDatabase).transaction('anime', 'readonly');
    const objectStore = transaction.objectStore('anime');
    const getAnime = objectStore.get(id);

    getAnime.onerror = (err) => {
      console.error(`Error get anime data by id: ${err}`);
      reject();
    };
    getAnime.onsuccess = (e: any) => {
      const target = e.target;
      const result = target.result as IMovieRecord;
      resolve(result);
    };
  });
};

const storeMovie = async (movie: IMovie): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = (db as IDBDatabase).transaction('anime', 'readwrite');
    const objectStore = transaction.objectStore('anime');
    const storeData = objectStore.add(movie);

    storeData.onerror = (err) => {
      console.error(`Error store new anime data: ${err}`);
      reject();
    };
    storeData.onsuccess = () => {
      console.log('Book added to the store', storeData.result);
      resolve();
    };
  });
};

const updateMovie = async (movie: IMovieRecord): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = (db as IDBDatabase).transaction('anime', 'readwrite');
    const objectStore = transaction.objectStore('anime');
    const { id: movieId, ...movieData } = movie;
    const getAnime = objectStore.get(movieId);
    getAnime.onerror = (err) => {
      console.error(`Anime data not found: ${err}`);
      reject();
    };

    getAnime.onsuccess = (e: any) => {
      const target = e.target;
      const currentAnime = target.result as IMovieRecord;
      currentAnime.title = movieData.title;
      currentAnime.director = movieData.director;
      currentAnime.summary = movieData.summary;
      currentAnime.genres = movieData.genres;

      const updateData = objectStore.put(currentAnime);
      updateData.onerror = (err) => {
        console.error(`Error update anime data by id: ${err}`);
        reject();
      };
      updateData.onsuccess = () => {
        console.log('Book updated to the store', updateData.result);
        resolve();
      };
    };
  });
};

const deleteMovie = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = (db as IDBDatabase).transaction('anime', 'readwrite');
    const objectStore = transaction.objectStore('anime');
    const getAnime = objectStore.get(id);

    getAnime.onerror = (err) => {
      console.error(`Anime data not found: ${err}`);
      reject();
    };
    getAnime.onsuccess = (e: any) => {
      const target = e.target;
      const id = target.result.id;
      const deleteStore = objectStore.delete(id);

      deleteStore.onerror = (err) => {
        console.error(`Error delete anime data by id: ${err}`);
        reject();
      };
      deleteStore.onsuccess = () => {
        resolve();
      };
    };
  });
};

export const useIndexedDb = () => {
  return {
    initDb,
    db,
    getMovie,
    getMovieById,
    storeMovie,
    updateMovie,
    deleteMovie,
  };
};
