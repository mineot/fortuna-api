<template>
  <Modal
    :title="props.title"
    :show="props.show"
    @close="onClose()"
    :actions="[
      {
        variant: 'secondary',
        label: 'Cancel',
        closeModal: true,
        click: () => form.resetAndClearErrors(),
      },
      {
        variant: 'secondary',
        label: 'Clear',
        closeModal: false,
        click: () => form.resetAndClearErrors(),
      },
      {
        variant: 'primary',
        label: 'Save',
        closeModal: false,
        click: () => onSave(),
      },
    ]"
  >
    <form @submit.prevent class="d-flex flex-column gap-3">
      <template v-for="(control, index) in props.controls" :key="index">
        <div class="d-flex flex-column gap-0">
          <label :for="control.id" class="form-label m-0 d-flex gap-2 align-items-center">
            <span>{{ control.label }}</span>
            <span v-if="control.required" class="required">*</span>
          </label>
          <input
            :type="control.type"
            :name="control.name"
            :id="control.id"
            :class="['form-control form-control-sm', { 'is-invalid': getError(control.name) }]"
          />
          <div v-if="getError(control.name)" class="invalid-feedback d-block">
            {{ getError(control.name) }}
          </div>
        </div>
      </template>
    </form>

    <!--
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" id="checkChecked" checked />
      <label class="form-check-label" for="checkChecked"> Checked checkbox </label>
    </div>

    <div class="form-check">
      <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault1" />
      <label class="form-check-label" for="radioDefault1"> Default radio </label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="radioDefault" id="radioDefault2" checked />
      <label class="form-check-label" for="radioDefault2"> Default checked radio </label>
    </div>

    <label for="range1" class="form-label">Example range</label>
    <input type="range" class="form-range" id="range1" /> 
    -->
  </Modal>
</template>

<style scoped>
.required {
  color: var(--bs-danger);
  font-size: 0.75rem;
}
</style>

<script setup lang="ts">
import { FormControlTypes } from './types.js';
import { onMounted, PropType } from 'vue';
import { useForm } from '@inertiajs/vue3';
import Modal from './modal.vue';

type FormModalControl = {
  id: string;
  name: string;
  type: FormControlTypes | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  value?: string | number | boolean | Date;
  defaultValue: string | number | boolean | Date;
};

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Form Modal',
    required: true,
  },
  controls: {
    type: Array as PropType<FormModalControl[]>,
    required: true,
  },
});

const emit = defineEmits(['close']);
const form = useForm({});

const getError = (controlName: string) => {
  const erros = form.errors as Record<string, string | undefined>;
  return erros[controlName];
};

function onClose() {
  emit('close');
}

function onSave() {
  form.post('/account-types', {
    onStart: () => {},
    onSuccess: () => {},
    onError: () => {},
  });
}

onMounted(() => {
  props.controls.forEach((control) => {
    form.transform((data) => {
      return {
        ...data,
        [control.name]: control.value ?? control.defaultValue,
      };
    });
  });
});
</script>
