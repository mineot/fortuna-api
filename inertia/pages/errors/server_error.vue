<template>
  <div class="container py-5">
    <div class="alert alert-danger mb-0" role="alert">
      <h1 class="h4 mb-2">{{ t('app.errors.serverErrorTitle') }}</h1>
      <p class="mb-0">{{ t('app.errors.serverErrorDescription') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '../../lib/i18n';

const { t } = useI18n();
</script>
