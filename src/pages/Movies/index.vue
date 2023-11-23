<template>
  <q-page class="row items-start justify-evenly full-width">
    <q-infinite-scroll
      @load="onLoad"
      :disable="isAllDataLoaded"
      :offset="250"
      class="col"
    >
      <q-pull-to-refresh @refresh="refresh">
        <div class="row">
          <div
            v-for="(movie, i) in movies"
            :key="`card-list-movie-${i}`"
            class="q-pa-md row items-start col-12 col-md-6 col-lg-4 col-xl-3"
          >
            <movie-card
              :title="movie.title"
              :director="movie.director"
              :summary="movie.summary"
              :genres="movie.genres"
              class="full-width"
              @click="goToDetail(movie)"
            />
          </div>
        </div>
      </q-pull-to-refresh>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" to="/movies/add" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { defineOptions, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MovieCard from 'src/components/MovieCard.vue';
import { useMovieStore } from 'src/stores/movie';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { IMovieRecord } from 'src/types/anime';

defineOptions({
  name: 'IndexPage',
});

const $q = useQuasar();
const router = useRouter();
const movieStore = useMovieStore();
movieStore.$reset();
const { movies, isAllDataLoaded } = storeToRefs(movieStore);

$q.loadingBar.stop();

const onLoad = async (index: number, done: () => void) => {
  await movieStore.fetch();
  done();
};

const refresh = async (done: () => void) => {
  await movieStore.fetch({ page: 1, limit: 10 }, true);
  done();
};

const goToDetail = (movie: IMovieRecord) => {
  $q.loadingBar.start();
  router.push('/movies/' + movie.id);
};

onMounted(async () => {
  await movieStore.fetch({ page: 1, limit: 10 }, true);
});

</script>
