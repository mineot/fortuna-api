<template>
  <div v-if="props.type === 'checkbox' || props.type === 'radio'" class="form-check">
    <Checkbox
      v-if="props.type === 'checkbox'"
      :id="props.id"
      :name="props.name"
      :disabled="props.disabled"
      v-model="formControlModel"
    />

    <Radio
      v-if="props.type === 'radio'"
      :id="props.id"
      :name="props.name"
      :disabled="props.disabled"
      v-model="formControlModel"
    />

    <label class="form-check-label" :for="props.id">
      {{ props.label }}
    </label>
  </div>

  <div v-else-if="props.type === 'range'">
    <label :for="props.id" class="form-label m-0">
      {{ props.label }}
    </label>

    <Ranger
      :id="props.id"
      :class="props.name"
      :disabled="props.disabled"
      v-model="formControlModel"
    />
  </div>

  <div v-else class="d-flex flex-column gap-0">
    <label :for="props.id" class="form-label m-0 d-flex gap-2 align-items-center">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="required">*</span>
    </label>

    <Textarea
      v-if="props.type === 'textarea'"
      :disabled="props.disabled"
      :id="props.id"
      :invalid="isInvalid"
      :name="props.name"
      :readonly="props.readonly"
      :required="props.required"
      v-model="formControlModel"
    />

    <Select
      v-else-if="props.type === 'select'"
      :disabled="props.disabled"
      :id="props.id"
      :invalid="isInvalid"
      :name="props.name"
      :options="props.options"
      :required="props.required"
      :searchable="props.searchable"
      v-model="formControlModel"
    />

    <Input
      v-else
      :disabled="props.disabled"
      :id="props.id"
      :invalid="isInvalid"
      :name="props.name"
      :readonly="props.readonly"
      :required="props.required"
      :type="props.type as InputTypes"
      v-model="formControlModel"
    />

    <div v-if="isInvalid" class="invalid-feedback d-block">
      {{ getErrorMessage }}
    </div>
  </div>
</template>

<style scoped>
.required {
  color: var(--bs-danger);
  font-size: 0.75rem;
}
</style>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { ErrorType, FormControlTypes, InputTypes, SelectOption } from './types.js';
import Checkbox from './checkbox.vue';
import Input from './input.vue';
import Radio from './radio.vue';
import Ranger from './ranger.vue';
import Select from './select.vue';
import Textarea from './textarea.vue';

const formControlModel = defineModel<string>({ default: '' });

const props = defineProps({
  type: {
    type: String as PropType<FormControlTypes>,
    required: false,
    default: 'text',
  },
  name: {
    type: String,
    required: false,
    default: '',
  },
  id: {
    type: String,
    required: false,
    default: '',
  },
  errors: {
    type: Object as PropType<ErrorType>,
    required: false,
    default: {},
  },
  required: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  label: {
    type: String,
    required: false,
    default: 'Form Control',
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    required: false,
    default: [],
  },
  searchable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const isInvalid = computed<boolean>(() => {
  return props.errors[props.name] !== undefined;
});

const getErrorMessage = computed<string>(() => {
  return props.errors[props.name] ?? '';
});
</script>
