import { RouteRecordRaw } from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';

import IndexMovies from 'pages/Movies/index.vue';
import DetailMovie from 'pages/Movies/detail.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/movies/' },
      {
        path: 'movies/',
        name: 'movies',
        component: IndexMovies,
      },
      {
        path: 'movies/:id',
        name: 'detail-movie',
        component: DetailMovie,
      },
      {
        path: 'movies/add',
        name: 'add-movie',
        component: DetailMovie,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
