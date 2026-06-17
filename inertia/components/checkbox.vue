<template>
  <input
    :disabled="props.disabled"
    :id="props.id"
    :name="props.name"
    class="form-check-input"
    type="checkbox"
    v-bind="$attrs"
    v-model="checkboxModel"
  />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const checkboxModel = defineModel({});

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
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
