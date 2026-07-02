<template>
  <h1>Homepage</h1>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';

const { t } = useI18n();
const { setTitle, clearTitle } = useAppStore();

onMounted(() => {
  setTitle(t('app.home.title'));
});

onUnmounted(() => {
  clearTitle();
});
</script>
