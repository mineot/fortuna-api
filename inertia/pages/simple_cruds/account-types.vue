<template>
  <Table
    ref="tableRef"
    route-path="/account-types/list"
    object-name="accountTypes"
    :headers="[
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
    :controls="formControls"
    :edit-id="editId"
    :edit-mode="editMode"
    :show="showFormModal"
    :success-message="t('app.accountTypes.successSave')"
    :title="{ create: t('app.accountTypes.new'), edit: t('app.accountTypes.edit') }"
    :url="'/account-types'"
    @close="onClose()"
    @success="onSuccess()"
  />

  <ConfirmModal
    type="remove"
    :show="showConfirmModal"
    :title="t('app.accountTypes.confirmDelete')"
    :message="t('app.accountTypes.confirmDeleteMessage')"
    @close="onCloseConfirmModal()"
    @cancel="onCloseConfirmModal()"
    @confirm="onDelete()"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import ConfirmModal from '~/components/confirm-modal.vue';
import FormModal from '~/components/form-modal.vue';
import Table from '~/components/table.vue';
import type { FormModalControlType } from '~/components/types';

const { t } = useI18n();
const { setTitle, clearTitle, setButtons, clearButtons, findById, archive } = useAppStore();

const editId = ref<number | null>(null);
const deleteId = ref<number | null>(null);
const editMode = computed(() => editId.value !== null);
const showFormModal = ref(false);
const showConfirmModal = ref(false);
const tableRef = ref<InstanceType<typeof Table>>();

const formControls = reactive<FormModalControlType>({
  name: {
    id: 'name',
    name: 'name',
    label: t('app.terms.name'),
    type: 'text',
    required: true,
    defaultValue: '',
  },
  description: {
    id: 'description',
    name: 'description',
    label: t('app.terms.description'),
    type: 'textarea',
    required: false,
    defaultValue: '',
  },
});

async function onAction(action: string, id: number) {
  if (action === 'edit') {
    const data = await findById<any>('/account-types', id);

    editId.value = id;
    formControls.name.value = data.name;
    formControls.description.value = data.description;
    showFormModal.value = true;
  } else if (action === 'delete') {
    showConfirmModal.value = true;
    deleteId.value = id;
  }
}

function onClose() {
  editId.value = null;
  showFormModal.value = false;
}

function onCloseConfirmModal() {
  showConfirmModal.value = false;
  deleteId.value = null;
}

async function onDelete() {
  try {
    const response = await archive('/account-types', deleteId.value ?? -1);

    if (response.fail) {
      toast.error(t('app.terms.error_occurred', [response.message]));
      return;
    }

    toast.success(t('app.accountTypes.successDelete'));
    tableRef.value?.refresh();
  } catch {
    toast.error(t('app.terms.error_unexpected'));
  } finally {
    onCloseConfirmModal();
  }
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
      click: () => {
        editId.value = null;
        formControls.name.value = '';
        formControls.description.value = '';
        showFormModal.value = true;
      },
    },
  ]);
});

onUnmounted(() => {
  clearTitle();
  clearButtons();
});
</script>
