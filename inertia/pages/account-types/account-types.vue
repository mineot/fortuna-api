<template>
  <Table
    route-path="/account-types/list"
    object-name="accountTypes"
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
  />

  <FormModal
    title="Account Type"
    :show="showFormModal"
    @close="onClose()"
    :controls="[
      {
        id: 'name',
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
      },
    ]"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import FormModal from '~/components/form-modal.vue';
import Table from '~/components/table.vue';

const { t } = useI18n();
const { setTitle, setButtons, clearButtons } = useAppStore();
const showFormModal = ref(false);

function onAction(action: string, id: number) {
  console.log(action, id);
}

function onClose() {
  showFormModal.value = false;
}

onMounted(() => {
  setTitle(t('app.accountTypes.title'));

  setButtons([
    {
      icon: 'bi bi-plus',
      title: t('app.accountTypes.new'),
      click: () => (showFormModal.value = true),
    },
  ]);
});

onUnmounted(() => {
  clearButtons();
});
</script>
