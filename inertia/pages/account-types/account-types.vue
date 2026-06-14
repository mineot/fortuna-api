<template>
  <Table :data-types="dataTypes" route-path="/account-types/list" object-name="accountTypes" />

  <Modal title="Modal" :show="modalShow" :actions="modalActions" @close="onClose()">
    <span>Teste</span>
  </Modal>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import Modal from '~/components/modal.vue';
import Table from '~/components/table.vue';

const { t } = useI18n();
const { setTitle, setButtons, clearButtons } = useAppStore();
const modalShow = ref(false);

const dataTypes: any = [
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
];

const modalActions: any = [
  { label: 'Close', variant: 'secondary', closeModal: true },
  {
    label: 'Save',
    variant: 'primary',
    closeModal: false,
    click: () => {
      console.log('save');
    },
  },
];

function onAction(action: string, id: number) {
  console.log(action, id);
}

function onClose() {
  modalShow.value = false;
}

onMounted(() => {
  setTitle(t('app.accountTypes.title'));

  setButtons([
    { icon: 'plus', title: t('app.accountTypes.new'), click: () => (modalShow.value = true) },
  ]);
});

onUnmounted(() => {
  clearButtons();
});
</script>
