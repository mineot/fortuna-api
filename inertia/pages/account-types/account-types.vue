<template>
  <h3>{{ t('app.accountTypes.title') }}</h3>

  <div>
    <button class="btn btn-sm btn-primary">New</button>
  </div>

  <Table
    :headers="[
      {
        type: 'column',
        key: 'name',
        label: 'Nome',
      },
      {
        type: 'column',
        key: 'description',
        label: 'Descrição',
      },
      {
        type: 'action',
        key: 'id',
        enableActions: ['edit', 'delete'],
        onAction,
      },
    ]"
    route-path="/account-types/list"
    object-name="accountTypes"
  />

  <!-- <Table
    :headers="tableHeaders"
    :rows="tableRows"
    :paginator="tablePaginator"
    @search="onSearch($event)"
  /> -->
</template>

<script setup lang="ts">
import { useI18n } from '~/lib/i18n';
import Table from '~/components/table.vue';

const { t } = useI18n();

function onAction(action: string, id: number) {
  console.log(action, id);
}

// async function loadData(page: number = 1) {
//   const response = await fetch(`/account-types/list?searchText=10&page=${page}`, {
//     headers: {
//       Accept: 'application/json',
//     },
//   });

//   const json = await response.json();

//   console.log(json);
// }

// loadData();

// import { computed, ComputedRef } from 'vue';
// import { usePage } from '@inertiajs/vue3';
// import AccountType from '#models/account_type';
// import type { Data } from '@generated/data';
// import type { TableHeader, TablePaginator, TableRow } from '~/components/types';

// const page = usePage<Data.SharedProps>();

// const tableHeaders: TableHeader = [
//   { value: 'Name' },
//   { value: 'Description' },
//   { value: '', fit: true },
// ];

// const tableRows: ComputedRef<TableRow> = computed(() => {
//   const accountTypes: AccountType[] = (page.props.accountTypes as any).data as AccountType[];

//   return accountTypes.map((accountType) => [
//     { type: 'column', value: accountType.name },
//     { type: 'column', value: accountType.description },
//     {
//       type: 'buttons',
//       buttons: [
//         {
//           icon: 'pencil-fill',
//           variant: 'secondary',
//           action: () => {
//             alert('Edit: ' + accountType.id);
//           },
//         },
//         {
//           icon: 'trash-fill',
//           variant: 'danger',
//           action: () => {
//             alert('Delete: ' + accountType.id);
//           },
//         },
//       ],
//     },
//   ]) as TableRow;
// });

// const tablePaginator: ComputedRef<TablePaginator> = computed<any>(() => {
//   const accountTypes: any = page.props.accountTypes;
//   return { path: '/account-types', meta: accountTypes.meta } as TablePaginator;
// });

// function onSearch(search: string) {
//   alert(search);
// }
</script>
