<template>
  <Table
    ref="tableRef"
    route-path="/category-groups/list"
    object-name="categoryGroups"
    :headers="[
      {
        type: 'column',
        key: 'name',
        label: t('app.terms.name'),
      },
      {
        type: 'column',
        key: 'position',
        label: t('app.terms.position'),
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
    :success-message="t('app.categoryGroups.successSave')"
    :title="{ create: t('app.categoryGroups.new'), edit: t('app.categoryGroups.edit') }"
    :url="'/category-groups'"
    @close="onClose()"
    @success="onSuccess()"
  />

  <ConfirmModal
    type="remove"
    :show="showConfirmModal"
    :title="t('app.categoryGroups.confirmDelete')"
    :message="t('app.categoryGroups.confirmDeleteMessage')"
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
  position: {
    id: 'position',
    name: 'position',
    label: t('app.terms.position'),
    type: 'number',
    required: false,
    defaultValue: 0,
  },
});

async function onAction(action: string, id: number) {
  if (action === 'edit') {
    const data = await findById<any>('/category-groups', id);

    editId.value = id;
    formControls.name.value = data.name;
    formControls.position.value = data.position;
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
    const response = await archive('/category-groups', deleteId.value ?? -1);

    if (response.fail) {
      toast.error(t('app.terms.error_occurred', [response.message]));
      return;
    }

    toast.success(t('app.categoryGroups.successDelete'));
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
  setTitle(t('app.categoryGroups.title'));

  setButtons([
    {
      icon: 'bi bi-plus',
      title: t('app.categoryGroups.new'),
      click: () => {
        editId.value = null;
        formControls.name.value = '';
        formControls.position.value = 0;
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
