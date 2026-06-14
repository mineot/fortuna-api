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

  <Toaster position="top-center" rich-colors />
</template>

<script setup lang="ts">
import { toast, Toaster } from 'vue-sonner';
import { usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import Navbar from '~/components/navbar.vue';
import Sidebar from '~/components/sidebar.vue';
import type { Data } from '@generated/data';

const page = usePage<Data.SharedProps>();

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
