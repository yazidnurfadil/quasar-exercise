<template>
  <q-card class="my-card" flat bordered>
    <q-card-section>
      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">
          {{ props.title }}
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-subtitle1">by {{ props.director }}</div>
      <div class="text-caption text-grey">
        {{ props.summary }}
      </div>
    </q-card-section>

    <q-card-section class="q-gutter-xs row q-mt-xs">
      <q-chip
        v-for="(genre, j) in props.genres"
        :key="`chip-genre-${j}`"
        color="primary"
        text-color="white"
      >
        {{ optionsGenres[genre]?.label || genre }}
      </q-chip>
    </q-card-section>

    <q-separator />
  </q-card>
</template>

<script setup lang="ts">
import { defineOptions, defineProps, withDefaults } from 'vue';
import { optionsGenres } from 'src/utils/constants';
import { IMovie } from 'src/types/anime';

const props = withDefaults(defineProps<IMovie>(), {
  title: '',
  director: '',
  summary: '',
  genres: (): string[] => [],
});

defineOptions({
  name: 'MovieCard',
});
</script>
