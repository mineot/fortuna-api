<template>
  <input
    :disabled="props.disabled"
    :id="props.id"
    :name="props.name"
    class="form-range"
    type="range"
    v-bind="$attrs"
    v-model="rangerModel"
  />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const rangerModel = defineModel({});

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
