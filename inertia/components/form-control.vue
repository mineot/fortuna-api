<template>
  <input
    class="form-control form-control-sm"
    :type="props.type ?? 'text'"
    :name="props.name"
    :placeholder="props.placeholder ?? ''"
    :required="props.required"
    v-model="formControlModel"
    v-bind="$attrs"
  />
</template>

<style scoped></style>

<script setup lang="ts">
import { PropType } from 'vue';
import type { FormControlTypes } from './types';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  name: {
    type: String,
    required: false,
  },
  type: {
    type: String as PropType<FormControlTypes>,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  required: {
    type: Boolean,
    default: false,
    required: false,
  },
});

const formControlModel = defineModel({});
</script>
