<template>
  <div class="d-flex flex-column gap-1 position-relative">
    <FormControl
      type="search"
      name="table_search"
      :placeholder="t('app.terms.search')"
      v-model="searchText"
    />

    <table class="table table-sm table-hover p-0 m-0">
      <thead>
        <tr>
          <template v-for="(header, index) in headers" :key="index">
            <th
              v-if="header.type === 'column'"
              scope="col"
              :class="{
                left: header?.align === 'left',
                center: header?.align === 'center',
                right: header?.align === 'right',
              }"
            >
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
            <td
              v-if="row.type === 'column'"
              class="align-middle"
              :class="{
                left: row?.align === 'left',
                center: row?.align === 'center',
                right: row?.align === 'right',
              }"
            >
              <span>{{ row.value }}</span>
            </td>
            <td v-if="row.type === 'action' && row.actions" class="d-flex gap-2">
              <i
                v-for="(action, index) in row.actions"
                :key="index"
                role="button"
                class="p-1 bi"
                :class="{
                  'bi-pencil-fill link-secondary': action.type === 'edit',
                  'bi-trash-fill text-danger link-danger': action.type === 'delete',
                }"
                data-bs-toggle="tooltip"
                :data-bs-title="action.title"
                @click="action.onAction(action.type, row.value)"
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
          :key="index"
          class="page-item"
          :class="{ active: currentPage === page }"
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
import FormControl from './form-control.vue';

type DataActionTypes = 'edit' | 'delete';

type DataAction = {
  type: DataActionTypes;
  title: string;
  onAction: (action: DataActionTypes, value: any) => void;
};

type Data = {
  type: 'column' | 'action';
  key: string;
  align?: 'left' | 'center' | 'right';
  actions?: DataAction[];
};

type Header = Data & { label?: string };
type Row = Data & { value: any };
type Meta = { total: number; lastPage: number; currentPage: number };

const props = defineProps({
  headers: {
    type: Array as PropType<Header[]>,
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
const tableData = ref<Row[]>([]);
const tableMeta = ref<Meta>({} as Meta);
const loading = ref<boolean>(false);
let timer: any = null;

const dataRows = computed(() => {
  return tableData.value.map((row: any) => {
    const list: Row[] = [];
    props.headers.forEach((header: Header) => {
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
