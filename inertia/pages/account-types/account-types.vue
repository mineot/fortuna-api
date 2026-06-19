<template>
  <Table
    ref="tableRef"
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
    :show="showFormModal"
    @close="onClose()"
    @success="onSuccess()"
    :title="t('app.accountTypes.new')"
    url="/account-types"
    :controls="[
      {
        id: 'name',
        name: 'name',
        label: t('app.terms.name'),
        type: 'text',
        required: true,
      },
      {
        id: 'description',
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
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
const tableRef = ref<InstanceType<typeof Table>>();
const showFormModal = ref(false);

function onAction(action: string, id: number) {
  console.log(action, id);
}

function onClose() {
  showFormModal.value = false;
}

function onSuccess() {
  tableRef.value?.refresh();
  onClose();
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
