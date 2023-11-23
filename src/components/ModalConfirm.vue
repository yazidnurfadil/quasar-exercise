<template>
  <q-dialog v-model="isModalShow" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          <q-avatar
            :icon="icon"
            :color="color"
            text-color="white"
            size="md"
            class="q-mr-sm"
          />
          {{ title }}
        </div>
      </q-card-section>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">{{ message }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="black" v-close-popup />
        <q-btn flat :label="okLabel" :color="color" @click="okAction" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue';
import { storeToRefs } from 'pinia';

import { useModalStore } from 'src/stores/modal';
const modalStore = useModalStore();
defineOptions({
  name: 'ModalConfirm',
});
const { isModalShow, icon, title, message, okLabel, color, okAction } =
  storeToRefs(modalStore);
</script>
