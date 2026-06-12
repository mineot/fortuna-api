<template>
  <input
    class="form-control form-control-sm"
    :type="props.type ?? 'text'"
    :placeholder="props.placeholder ?? ''"
    v-model="formControlModel"
    v-bind="$attrs"
  />
</template>

<style scoped></style>

<script setup lang="ts">
import { PropType } from 'vue';
import type { InputTypes } from './types';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  type: {
    type: String as PropType<InputTypes>,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
});

const formControlModel = defineModel({});
</script>
