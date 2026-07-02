<template>
  <h1>Form Modal</h1>
</template>

<!-- <template>
  <Modal
    :title="title"
    :show="props.show"
    @close="onClose()"
    :actions="[
      {
        variant: 'secondary',
        label: t('app.terms.cancel'),
        closeModal: true,
        click: () => onClose(),
      },
      {
        variant: 'secondary',
        label: t('app.terms.clear'),
        closeModal: false,
        click: () => resetAndClearErrors(),
      },
      {
        variant: 'primary',
        label: t('app.terms.save'),
        closeModal: false,
        loading: isLoading,
        click: () => onSave(),
      },
    ]"
  >
    <form @submit.prevent class="d-flex flex-column gap-3">
      <FormControl
        v-for="(control, index) in controls"
        :errors="errors"
        :id="control.id"
        :key="index"
        :label="control.label"
        :name="control.name"
        :placeholder="control.placeholder"
        :required="control.required"
        :type="control.type"
        v-model="data[control.name]"
      />
    </form>
  </Modal>
</template>

<style scoped>
.required {
  color: var(--bs-danger);
  font-size: 0.75rem;
}
</style>

<script setup lang="ts">
import { computed, ComputedRef, PropType, reactive, ref, watch } from 'vue';
import { FormModalControl, FormModalControlType, FormModalTitle } from './types.js';
import { toast } from 'vue-sonner';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import FormControl from './form-control.vue';
import Modal from './modal.vue';

const { getCsrfHeader } = useAppStore();
const { t } = useI18n();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: Object as PropType<FormModalTitle>,
    default: 'Form Modal',
    required: true,
  },
  controls: {
    type: Object as PropType<FormModalControlType>,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  successMessage: {
    type: String,
    default: 'Saved successfully',
  },
  editMode: {
    type: Boolean,
    default: false,
    required: false,
  },
  editId: {
    type: Number as PropType<number | null>,
    default: null,
    required: false,
  },
});

const emit = defineEmits(['close', 'success']);

const controls = computed<FormModalControl[]>(() =>
  Array.isArray(props.controls) ? props.controls : Object.values(props.controls),
);

const data = reactive(buildData());
const errors = reactive<Record<string, string | undefined>>({});
const loading = ref(false);
const isLoading: ComputedRef<boolean> = computed(() => loading.value);
const title = computed(() => (props.editMode ? props.title.edit : props.title.create));
const url = computed(() => (props.editMode ? `${props.url}/${props.editId}` : props.url));

function buildData(): Record<string, any> {
  return Object.fromEntries(controls.value.map((c) => [c.name, c.value ?? c.defaultValue ?? null]));
}

function onClose() {
  emit('close');
  resetAndClearErrors();
}

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k]);
}

function resetAndClearErrors() {
  Object.assign(data, buildData());
  clearErrors();
}

async function onSave() {
  loading.value = true;
  clearErrors();

  try {
    const response = await fetch(url.value, {
      method: props.editMode ? 'PUT' : 'POST',
      credentials: 'include',
      headers: getCsrfHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 422) {
        const body = await response.json();

        if (body.errors) {
          for (const err of body.errors) {
            errors[err.field] = err.message;
          }
        }

        return;
      }

      const body = await response.json().catch(() => ({}));
      toast.error(t('app.terms.error_occurred', [body.message]));
      return;
    }

    const body = await response.json();
    emit('success', body.data ?? body);
    toast.success(props.successMessage);
  } catch {
    toast.error(t('app.terms.error_unexpected'));
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.show,
  (open) => {
    if (open) {
      Object.assign(data, buildData());
      clearErrors();
    }
  },
);
</script> -->
