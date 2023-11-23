<template>
  <q-page class="row items-start justify-evenly window-width">
    <q-form
      ref="myForm"
      @reset="onReset"
      @submit="submitForm"
      @validation-error="onValidationError"
      class="q-pa-md q-gutter-md"
    >
      <q-input
        filled
        v-model="selectedMovie.title"
        label="Movie Title *"
        hint="Name and surname"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        lazy-rules
        :rules="[requiredRules]"
      />
      <q-input
        filled
        v-model="selectedMovie.director"
        label="Director *"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        lazy-rules
        :rules="[requiredRules]"
      />
      <q-input
        filled
        type="textarea"
        v-model="selectedMovie.summary"
        label="Summary *"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        lazy-rules
        :rules="[requiredRules]"
      />

      <div
        class="q-pa-sm rounded-borders"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
      >
        Genres
        <div class="q-gutter-xs row q-mt-xs">
          <q-chip
            v-for="(genre, j) in optionsGenres"
            :key="`chip-genre-${j}`"
            v-model:selected="selectedMovie.genres[genre.value]"
            :color="selectedMovie.genres[genre.value] ? 'primary' : 'white'"
            :text-color="selectedMovie.genres[genre.value] ? 'white' : 'black'"
            :style="`order: ${selectedMovie.genres[genre.value] ? 1 : 2}`"
          >
            {{ genre.label }}
          </q-chip>
        </div>
      </div>
      <div>
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-page>
  <Teleport to="#navbar-actions" v-if="isMounted">
    <q-btn-dropdown
      v-if="formMode === 'edit'"
      auto-close
      rounded
      color="green"
      label="Save"
      split
      @click="onSubmitClick"
    >
      <q-list dense style="width: 100px">
        <q-item
          dense
          clickable
          class="flex-center"
          @click="modalStore.showDeleteConfirm(dataToReset.title, del)"
        >
          <q-icon name="delete" color="red" size="xs" />
          <q-item-section class="q-ml-xs">
            <q-item-label class="text-weight-medium text-red">
              Delete
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn
      v-else
      rounded
      color="green"
      label="Submit"
      type="submit"
      @click="onSubmitClick"
    />
  </Teleport>
  <ModalConfirm />
</template>

<script setup lang="ts">
import { defineOptions, onMounted, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, QForm } from 'quasar';
import { storeToRefs } from 'pinia';
import { optionsGenres } from 'src/utils/constants';
import ModalConfirm from 'src/components/ModalConfirm.vue';

import { useMovieStore } from 'src/stores/movie';
import { useModalStore } from 'src/stores/modal';
const movieStore = useMovieStore();
const modalStore = useModalStore();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const { selectedMovie, formMode } = storeToRefs(movieStore);
const { isModalShow } = storeToRefs(modalStore);

defineOptions({
  name: 'DetailPage',
});
formMode.value = route.params.id ? 'edit' : 'add';

const cloneDeep = (obj: any) => structuredClone(toRaw(obj));
let dataToReset = cloneDeep(movieStore.selectedMovie);

const myForm = ref<QForm>();
const isMounted = ref<boolean>(false);

const onSubmitClick = () => {
  myForm.value?.submit();
};

const submitForm = async () => {
  if (formMode.value === 'edit') {
    modalStore.showUpdateConfirm(createUpdate);
  } else {
    modalStore.showCreateConfirm(createUpdate);
  }
};

const createUpdate = async () => {
  $q.loading.show();
  let notifCaption = 'Movie successfully updated';
  if (formMode.value === 'edit') {
    await movieStore.update();
  } else {
    await movieStore.add();
    notifCaption = 'Movie successfully created';
  }
  $q.notify({
    message: 'Success',
    caption: notifCaption,
    type: 'positive',
  });
  isModalShow.value = false;
  $q.loading.hide();
  router.push('/movies');
};

const del = async () => {
  $q.loading.show();
  await movieStore.delete();
  $q.notify({
    message: 'Success',
    caption: 'Movie successfully deleted',
    type: 'positive',
  });
  $q.loading.hide();
  isModalShow.value = false;
  router.push('/movies');
};
const onReset = () => {
  selectedMovie.value = cloneDeep(dataToReset);
  const form = myForm.value as any;
  form.resetValidation();
};

const requiredRules = (val: string) => {
  if (val && val.length > 0) {
    return true;
  } else {
    return 'Please type something';
  }
};

// create notification
const onValidationError = () => {
  $q.notify({
    message: 'Invalid field(s)',
    caption: 'Please check the form and correct the errors',
    type: 'negative',
  });
};

onMounted(async () => {
  if (route.params.id) {
    await movieStore.retrive(Number(route.params.id));
    dataToReset = cloneDeep(movieStore.selectedMovie);
  }
  isMounted.value = true;
  $q.loadingBar.stop();
});
</script>
