<template>
  <slot />
</template>

<script setup lang="ts">
import { provide } from 'vue';
import { FormError } from './form.types';

const props = defineProps<{ errors: FormError }>();
provide('formErrors', props.errors);
</script>
