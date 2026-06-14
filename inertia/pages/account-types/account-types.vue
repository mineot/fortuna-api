<template>
  <Table
    :data-types="[
      {
        type: 'column',
        key: 'name',
        label: t('app.terms.name'),
      },
      {
        type: 'column',
        key: 'description',
        label: t('app.terms.description'),
      },
      {
        type: 'action',
        key: 'id',
        actions: [
          {
            type: 'edit',
            title: t('app.terms.edit'),
            onAction,
          },
          {
            type: 'delete',
            title: t('app.terms.delete'),
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

  setButtons([{ icon: 'plus', title: t('app.accountTypes.new'), click: () => console.log('new') }]);
});

onUnmounted(() => {
  clearButtons();
});
</script>
