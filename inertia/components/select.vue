<template>
  <select
    :class="['form-select form-select-sm', { 'is-invalid': props.invalid }]"
    :disabled="props.disabled"
    :id="props.id"
    :name="props.name"
    :required="props.required"
    v-bind="$attrs"
    v-model="selectModel"
  >
    <option v-if="props.placeholder" selected>{{ props.placeholder }}</option>
    <option v-for="(option, index) in props.options" :key="index" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { SelectOption } from './types';

defineOptions({
  inheritAttrs: false,
});

const selectModel = defineModel({});

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: '',
  },
  name: {
    type: String,
    required: false,
    default: '',
  },
  placeholder: {
    type: String,
    required: false,
    default: '',
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
  invalid: {
    type: Boolean,
    required: false,
    default: false,
  },
  options: {
    type: Array as PropType<SelectOption[]>,
    required: false,
    default: [],
  },
});
</script>
