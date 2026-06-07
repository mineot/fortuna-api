<template>
  <h1>{{ t('app.accountTypes.title') }}</h1>

  <ul>
    <li v-for="accountType in accountTypes" :key="accountType.id">
      {{ accountType.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { usePage } from '@inertiajs/vue3';
import AccountType from '#models/account_type';
import type { Data } from '@generated/data';
import { useI18n } from '~/lib/i18n';

const page = usePage<Data.SharedProps>();
const { t } = useI18n();

const accountTypes: ComputedRef<AccountType[]> = computed<AccountType[]>(() => {
  return page.props.accountTypes as AccountType[];
});
</script>
