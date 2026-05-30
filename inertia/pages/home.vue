<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { useI18n } from '../lib/i18n';

const { t } = useI18n();
</script>

<template>
  <Head :title="t('app.home.title')" />

  <section class="p-4 p-md-5 mb-4 bg-body rounded-3 border border-secondary-subtle">
    <div class="container-fluid py-2">
      <h1 class="display-6 fw-semibold mb-3">{{ t('app.home.heroTitle') }}</h1>
      <p class="col-md-10 fs-5 text-secondary mb-0">
        {{ t('app.home.heroDescription') }}
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
          <h2 class="h5 card-title mb-2">
            <i class="bi bi-book me-2"></i>{{ t('app.home.docs') }}
          </h2>
          <p class="card-text text-secondary mb-0">{{ t('app.home.docsDescription') }}</p>
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
          <h2 class="h5 card-title mb-2">
            <i class="bi bi-lightning-charge me-2"></i>{{ t('app.home.inertia') }}
          </h2>
          <p class="card-text text-secondary mb-0">{{ t('app.home.inertiaDescription') }}</p>
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
          <h2 class="h5 card-title mb-2">
            <i class="bi bi-palette me-2"></i>{{ t('app.home.bootstrap') }}
          </h2>
          <p class="card-text text-secondary mb-0">{{ t('app.home.bootstrapDescription') }}</p>
        </div>
      </a>
    </div>
  </section>
</template>
