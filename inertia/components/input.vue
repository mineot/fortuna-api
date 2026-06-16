<template>
  <input
    :class="['form-control form-control-sm', { 'is-invalid': invalid }]"
    :id="props.id"
    :name="props.name"
    :placeholder="props.placeholder ?? ''"
    :required="props.required"
    :type="props.type ?? 'text'"
    v-bind="$attrs"
    v-model="inputModel"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { InputTypes, ModelValueTypes } from './types';

defineOptions({
  inheritAttrs: false,
});

const inputModel = defineModel({
  type: Object as PropType<ModelValueTypes>,
});

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
  type: {
    type: String as PropType<InputTypes>,
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
  invalid: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
