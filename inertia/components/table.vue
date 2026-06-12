<template>
  <div class="d-flex flex-column gap-1">
    <FormControl type="search" :placeholder="t('app.terms.search')" v-model="search" />

    <table class="table table-sm table-hover p-0 m-0">
      <thead>
        <tr>
          <th v-for="header in props.headers" scope="col" :class="{ fit: header.fit ?? false }">
            {{ header.value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="props.rows.length === 0">
          <td colspan="100%" class="text-center">{{ t('app.terms.noRecordsFound') }}</td>
        </tr>
        <tr v-else v-for="columns in props.rows">
          <template v-for="item in columns" :key="item">
            <td v-if="item.type === 'column'">{{ item.value }}</td>
            <td v-if="item.type === 'buttons'" class="d-flex gap-1">
              <Button
                v-for="btn in item.buttons"
                :icon="btn.icon"
                :label="btn.label"
                :variant="btn.variant"
                @click="btn.action"
              />
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <nav class="d-flex align-items-center justify-content-between">
      <ul class="pagination pagination-sm p-0 m-0">
        <li class="page-item">
          <a class="page-link" :href="firstPageUrl">
            <i class="bi bi-chevron-double-left"></i>
          </a>
        </li>
        <li
          v-for="page in pages"
          :class="{ active: page.active }"
          :key="page.label"
          class="page-item"
        >
          <a class="page-link" :href="page.url">{{ page.label }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" :href="lastPageUrl">
            <i class="bi bi-chevron-double-right"></i>
          </a>
        </li>
      </ul>
      <span class="fs-6 text-body-tertiary">
        {{ t('app.terms.totalRecords', [props.paginator.meta.total]) }}
      </span>
    </nav>
  </div>
</template>

<style scoped>
.fit {
  width: 1%;
}
</style>

<script setup lang="ts">
import { computed, ComputedRef, onUnmounted, PropType, ref, watch } from 'vue';
import { useI18n } from '~/lib/i18n.js';
import Button from './button.vue';
import FormControl from './form-control.vue';
import type { TableHeader, TablePaginator, TableRow } from './types.js';

const { t } = useI18n();

const props = defineProps({
  headers: {
    type: Array as PropType<TableHeader>,
    required: true,
  },
  rows: {
    type: Array as PropType<TableRow>,
    required: true,
  },
  paginator: {
    type: Object as PropType<TablePaginator>,
    required: true,
  },
});

let searchTimeout: any = null;

const emit = defineEmits(['search']);

const search = ref('');

const firstPageUrl: ComputedRef<string> = computed<string>(() => {
  return props.paginator.path + props.paginator.meta.firstPageUrl;
});

const lastPageUrl: ComputedRef<string> = computed<string>(() => {
  return props.paginator.path + props.paginator.meta.lastPageUrl;
});

const pages: ComputedRef<any[]> = computed<any[]>(() => {
  return Array.from({ length: props.paginator.meta.lastPage }, (_, index) => ({
    label: index + 1,
    url: props.paginator.path + '?page=' + (index + 1),
    active: index + 1 === props.paginator.meta.currentPage,
  }));
});

watch(search, (value) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    emit('search', value);
  }, 400);
});

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>
