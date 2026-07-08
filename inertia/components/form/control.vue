<template>
  <div class="d-flex flex-column">
    <div class="d-flex gap-1 align-items-end">
      <small>{{ props.label }}</small>
      <small class="text-danger" v-if="props.required">*</small>
    </div>
    <div class="position-relative">
      <slot />
    </div>
    <ErrorMessage as="small" :name="props.name" class="text-danger" />
  </div>
</template>

<script setup lang="ts">
import { baseControlProps } from './form.types';
const props = defineProps(baseControlProps);
</script>
