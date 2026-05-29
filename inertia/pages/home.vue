<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
</script>

<template>
  <Head title="Homepage" />

  <section class="p-4 p-md-5 mb-4 bg-body rounded-3 border border-secondary-subtle">
    <div class="container-fluid py-2">
      <h1 class="display-6 fw-semibold mb-3">Fortuna ready with Vue + Bootstrap</h1>
      <p class="col-md-10 fs-5 text-secondary mb-0">
        Server-driven UI with Inertia, Vue components, and Bootstrap dark theme as the global UI
        base.
      </p>
    </div>
  </section>

  <section class="row g-3">
    <div class="col-12 col-md-4">
      <a
        href="https://docs.adonisjs.com/"
        target="_blank"
        class="card h-100 text-decoration-none bg-body border-secondary-subtle"
      >
        <div class="card-body">
          <h2 class="h5 card-title mb-2"><i class="bi bi-book me-2"></i>Docs</h2>
          <p class="card-text text-secondary mb-0">Official AdonisJS reference.</p>
        </div>
      </a>
    </div>
    <div class="col-12 col-md-4">
      <a
        href="https://inertiajs.com/"
        target="_blank"
        class="card h-100 text-decoration-none bg-body border-secondary-subtle"
      >
        <div class="card-body">
          <h2 class="h5 card-title mb-2"><i class="bi bi-lightning-charge me-2"></i>Inertia</h2>
          <p class="card-text text-secondary mb-0">Guide for server-driven navigation with Vue.</p>
        </div>
      </a>
    </div>
    <div class="col-12 col-md-4">
      <a
        href="https://getbootstrap.com/docs/5.3/getting-started/introduction/"
        target="_blank"
        class="card h-100 text-decoration-none bg-body border-secondary-subtle"
      >
        <div class="card-body">
          <h2 class="h5 card-title mb-2"><i class="bi bi-palette me-2"></i>Bootstrap</h2>
          <p class="card-text text-secondary mb-0">Global styles and component system.</p>
        </div>
      </a>
    </div>
  </section>
</template>
