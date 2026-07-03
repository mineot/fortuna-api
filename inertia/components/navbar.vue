<template>
  <Head :title="getTitle()" />

  <header class="navbar navbar-expand-lg bg-body border-bottom border-secondary-subtle">
    <div
      class="container-fluid d-flex flex-column flex-sm-row gap-3 align-items-start align-items-sm-center justify-content-between"
    >
      <div class="d-flex gap-3 align-items-center">
        <i
          v-if="page.props.user"
          class="bi bi-list text-lg"
          role="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="sidebar"
        />

        <Link route="home" class="navbar-brand fw-semibold brand-logo m-0">
          <span>{{ t('app.brand') }}</span>
        </Link>

        <span class="text-sm text-secondary d-none d-sm-block">{{ getTitle() }}</span>
      </div>

      <nav class="d-flex flex-wrap align-items-center gap-2">
        <template v-if="page.props.user">
          <Button
            v-for="(button, index) in getButtons()"
            variant="secondary"
            :key="index"
            :icon="button.icon"
            :title="button.title"
            :disabled="button.disabled ?? false"
            @click="button.click"
          />
        </template>

        <template v-else>
          <Link route="new_account.create" class="btn btn-sm btn-secondary">
            <i class="bi bi-person-plus me-1"></i>
            {{ t('app.auth.signup') }}
          </Link>
          <Link route="session.create" class="btn btn-sm btn-primary">
            <i class="bi bi-box-arrow-in-right me-1"></i>
            {{ t('app.auth.login') }}
          </Link>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { Link } from '@adonisjs/inertia/vue';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import Button from '~/components/button.vue';

const page = usePage();
const { t } = useI18n();
const { getTitle, getButtons } = useAppStore();
</script>
