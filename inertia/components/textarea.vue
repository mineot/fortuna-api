<template>
  <textarea
    :class="['form-control', { 'is-invalid': props.invalid }]"
    :cols="props.cols"
    :disabled="props.disabled"
    :id="props.id"
    :name="props.name"
    :placeholder="props.placeholder"
    :readonly="props.readonly"
    :required="props.required"
    :rows="props.rows"
    v-bind="$attrs"
    v-model="textareaModel"
  />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const textareaModel = defineModel<string>({ default: '' });

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
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  invalid: {
    type: Boolean,
    required: false,
    default: false,
  },
  cols: {
    type: Number,
    required: false,
    default: 30,
  },
  rows: {
    type: Number,
    required: false,
    default: 3,
  },
});
</script>
