<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="route.name === 'detail-movie' || route.name === 'add-movie'"
          flat
          round
          dense
          icon="arrow_back"
          @click="goBack"
        />
        <q-toolbar-title> Zid Movies Library </q-toolbar-title>

        <q-input
          v-if="route.name === 'movies'"
          dark
          dense
          standout
          v-model="searchMovies"
          placeholder="Search Movies"
          input-class="text-right"
          class="q-ml-md"
          :debounce="300"
          @update:model-value="onSearch"
        >
          <template v-slot:append>
            <q-icon v-if="searchMovies === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="clearSearch"
            />
          </template>
        </q-input>
        <div
          v-else-if="
            route.name === 'detail-movie' || route.name === 'add-movie'
          "
        >
          <div id="navbar-actions"></div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { defineOptions, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from 'src/stores/movie';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();
defineOptions({
  name: 'MainLayout',
});

const searchMovies = ref<string>('');

const $q = useQuasar();
const goBack = () => {
  $q.loadingBar.start();
  searchMovies.value = '';
  router.push('/movies');
};

const clearSearch = () => {
  searchMovies.value = '';
  onSearch(null);
};

const onSearch = async (val: string | number | null) => {
  await movieStore.fetch({ page: 1, limit: 10, search: val as string }, true);
};
</script>
