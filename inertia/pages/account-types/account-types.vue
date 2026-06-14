<template>
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
        actions: [
          {
            type: 'edit',
            title: 'Editar',
            onAction,
          },
          {
            type: 'delete',
            title: 'Excluir',
            onAction,
          },
        ],
      },
    ]"
    route-path="/account-types/list"
    object-name="accountTypes"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import Table from '~/components/table.vue';

const { t } = useI18n();
const { setTitle, setButtons, clearButtons } = useAppStore();

function onAction(action: string, id: number) {
  console.log(action, id);
}

onMounted(() => {
  setTitle(t('app.accountTypes.title'));

  setButtons([{ icon: 'plus', title: 'Novo Tipo de Conta', click: () => console.log('new') }]);
});

onUnmounted(() => {
  clearButtons();
});
</script>
