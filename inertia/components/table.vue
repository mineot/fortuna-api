<template>
  <div class="d-flex flex-column gap-1 position-relative">
    <Input
      :placeholder="t('app.terms.search')"
      name="table_search"
      type="search"
      v-model="searchText"
    />

    <table class="table table-bordered table-hover p-0 m-0">
      <thead>
        <tr>
          <template v-for="(header, index) in headers" :key="index">
            <th v-if="header.type === 'column'" scope="col" :class="getAlign(header.align)">
              {{ header.label }}
            </th>
            <th v-if="header.type === 'action'" scope="col" class="fit"></th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isEmpty">
          <td class="text-center" colspan="100%">
            {{ t('app.terms.noRecordsFound') }}
          </td>
        </tr>
        <tr v-for="(rows, index) in dataRows" :key="index">
          <template v-for="(row, index) in rows" :key="index">
            <td v-if="row.type === 'column'" :class="['align-middle', getAlign(row.align)]">
              <span>{{ row.value }}</span>
            </td>
            <td v-if="row.type === 'action' && row.actions" class="d-flex gap-2">
              <Button
                v-for="(action, index) in row.actions"
                :icon="getIcon(action.type)"
                :key="index"
                :title="action.title"
                :variant="getVariant(action.type)"
                @click="action.onAction(action.type, row.value)"
                type="button"
              />
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <nav class="d-flex align-items-center justify-content-between">
      <ul class="pagination pagination-sm p-0 m-0">
        <li class="page-item">
          <span class="page-link" @click="setPage(1)" role="button">
            <i class="bi bi-chevron-double-left"></i>
          </span>
        </li>
        <li
          v-for="(page, index) in pages"
          :class="['page-item', { active: currentPage === page }]"
          :key="index"
        >
          <span class="page-link" @click="setPage(page)" role="button">
            {{ page }}
          </span>
        </li>
        <li class="page-item">
          <span class="page-link" @click="setPage(tableMeta.lastPage)" role="button">
            <i class="bi bi-chevron-double-right"></i>
          </span>
        </li>
      </ul>
      <span class="fs-6 text-body-tertiary">
        {{ t('app.terms.totalRecords', [tableMeta.total]) }}
      </span>
    </nav>

    <div
      v-if="loading"
      class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
    >
      <span class="spinner-border spinner-border-lg me-2" role="status" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.fit {
  width: 1%;
}

.left {
  text-align: left;
}

.center {
  text-align: center;
}

.right {
  text-align: right;
}
</style>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n.js';
import Button from './button.vue';
import Input from './input.vue';

import {
  AlignTypes,
  TableDataActionTypes,
  TableHeader,
  TableMeta,
  TableRow,
  Variants,
} from './types.js';

const props = defineProps({
  headers: {
    type: Array as PropType<TableHeader[]>,
    required: true,
  },
  routePath: {
    type: String,
    required: true,
  },
  objectName: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const { refreshTooltips } = useAppStore();
const currentPage = ref<number>(1);
const searchText = ref<string>('');
const tableData = ref<TableRow[]>([]);
const tableMeta = ref<TableMeta>({} as TableMeta);
const loading = ref<boolean>(false);
let timer: any = null;

const iconTypes = {
  edit: 'bi-pencil-fill',
  delete: 'bi-trash-fill',
};

const getIcon = (type: TableDataActionTypes): string => {
  return iconTypes[type];
};

const getVariant = (type: TableDataActionTypes): Variants => {
  return type === 'edit' ? 'secondary' : 'danger';
};

const getAlign = (align: AlignTypes | undefined) => {
  return {
    left: align === 'left',
    center: align === 'center',
    right: align === 'right',
  };
};

const dataRows = computed(() => {
  return tableData.value.map((row: any) => {
    const list: TableRow[] = [];
    props.headers.forEach((header: TableHeader) => {
      list.push({
        type: header.type,
        key: header.key,
        align: header.align,
        actions: header.actions,
        value: row[header.key],
      });
    });
    return list;
  });
});

const pages = computed(() => {
  return Array.from({ length: tableMeta.value.lastPage }, (_, i) => i + 1);
});

const isEmpty = computed(() => {
  return dataRows.value.length === 0;
});

function setPage(page: number) {
  if (currentPage.value !== page) {
    currentPage.value = page;
    refresh();
  }
}

async function refresh() {
  try {
    loading.value = true;

    const qs = new URLSearchParams();
    qs.set('page', String(currentPage.value));

    if (searchText.value) {
      qs.set('searchText', searchText.value);
    }

    const response = await fetch(`${props.routePath}?${qs.toString()}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const json = await response.json();
    tableData.value = json[props.objectName].data;
    tableMeta.value = json[props.objectName].meta;
  } finally {
    loading.value = false;

    setTimeout(() => {
      refreshTooltips();
    }, 500);
  }
}

defineExpose({ refresh });

onMounted(() => {
  refresh();
});

watch(searchText, () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    currentPage.value = 1;
    refresh();
  }, 500);
});
</script>
