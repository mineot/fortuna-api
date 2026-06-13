<template>
  <div class="d-flex flex-column gap-1">
    <FormControl type="search" name="table_search" :placeholder="t('app.terms.search')" />

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
        <!-- <tr v-for="(row, index) in dataRows" :key="index">
          <template v-for="(header, index) in headers" :key="index">
            <td v-if="header.type === 'column'">{{ row[header.key].value }}</td>
            <td class="d-flex flex-nowrap gap-3 align-items-center justify-content-around">
              <i class="bi bi-pencil-fill" role="button"></i>
              <i class="bi bi-trash3-fill text-danger" role="button"></i>
            </td>
          </template>
        </tr> -->
      </tbody>
    </table>

    <nav class="d-flex align-items-center justify-content-between">
      <ul class="pagination pagination-sm p-0 m-0">
        <li class="page-item">
          <a class="page-link" href="#">
            <i class="bi bi-chevron-double-left"></i>
          </a>
        </li>
        <li class="page-item">
          <a href="#" class="page-link">1</a>
        </li>
        <li class="page-item">
          <a href="#" class="page-link">2</a>
        </li>
        <li class="page-item">
          <a href="#" class="page-link">3</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">
            <i class="bi bi-chevron-double-right"></i>
          </a>
        </li>
      </ul>
      <span class="fs-6 text-body-tertiary">
        {{ t('app.terms.totalRecords', [10]) }}
      </span>
    </nav>
  </div>

  {{ dataRows }}
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
import { computed, onMounted, PropType } from 'vue';
import { ref } from 'vue';
import { useI18n } from '~/lib/i18n.js';
import FormControl from './form-control.vue';

type Data = {
  type: 'column' | 'action';
  key: string;
  align?: 'left' | 'center' | 'right';
  enableActions?: Array<'edit' | 'delete'>;
  onAction?: (action: 'edit' | 'delete', value: any) => void;
};

type Header = Data & { label?: string };

type Row = Data & { value: any };

const { t } = useI18n();
const tableData = ref([]);
const tableMeta = ref({});

const dataRows = computed(() => {
  const rows = tableData.value.map((row: any) => {
    const rw: Row = { type: 'column', key: '', value: null };
    props.headers.forEach((header: Header) => {
      rw.type = header.type;
      rw.key = header.key;
      rw.align = header.align;
      rw.enableActions = header.enableActions;
      rw.onAction = header.onAction;
      rw.value = row[header.key];
    });
    return rw;
  });

  console.log(rows);

  return [];
});

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

async function refresh() {
  const response = await fetch(props.routePath, {
    headers: {
      Accept: 'application/json',
    },
  });

  const json = await response.json();

  tableData.value = json[props.objectName].data;
  tableMeta.value = json[props.objectName].meta;
}

onMounted(() => {
  refresh();
});
</script>
