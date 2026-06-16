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
      <FormControl
        v-for="(control, index) in props.controls"
        :key="index"
        :errors="form.errors"
        :id="control.id"
        :label="control.label"
        :name="control.name"
        :placeholder="control.placeholder"
        :required="control.required"
        :type="control.type"
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
import { FormControlTypes } from './types.js';
import { onMounted, PropType } from 'vue';
import { useForm } from '@inertiajs/vue3';
import FormControl from './form-control.vue';
import Modal from './modal.vue';

type FormModalControl = {
  id: string;
  name: string;
  type: FormControlTypes;
  label: string;
  placeholder?: string;
  required?: boolean;
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
  // props.controls.forEach((control) => {
  //   form.transform((data) => {
  //     return {
  //       ...data,
  //       [control.name]: control.value ?? control.defaultValue,
  //     };
  //   });
  // });
});
</script>
