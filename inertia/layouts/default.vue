<template>
  <section class="app-shell">
    <Navbar />
    <main class="container-fluid">
      <slot />
    </main>
  </section>

  <template v-if="page.props.user">
    <Sidebar />
  </template>

  <div :class="['loading', showSpinner]">
    <div class="spinner spinner-border text-secondary" role="status"></div>
  </div>

  <Toaster position="top-center" rich-colors />
</template>

<style scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  display: none;
  justify-content: center;
  align-items: center;

  &.show {
    display: flex;
  }

  > .spinner {
    width: 5rem;
    height: 5rem;
    font-size: 2rem;
  }
}
</style>

<script setup lang="ts">
import { toast, Toaster } from 'vue-sonner';
import { usePage } from '@inertiajs/vue3';
import { computed, watch } from 'vue';
import Navbar from '~/components/navbar.vue';
import Sidebar from '~/components/sidebar.vue';
import type { Data } from '@generated/data';
import { useAppStore } from '~/stores/app.store';

const { isLoading } = useAppStore();

const page = usePage<Data.SharedProps>();
const showSpinner = computed(() => (isLoading() ? 'show' : ''));

watch(
  () => page.url,
  () => toast.dismiss(),
);

watch(
  () => page.props.flash,
  (flashMessages) => {
    if (flashMessages.error) {
      toast.error(flashMessages.error);
    }

    if (flashMessages.success) {
      toast.success(flashMessages.success);
    }
  },
  { immediate: true },
);
</script>
