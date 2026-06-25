<template>
  <i
    v-if="props.type === 'icon'"
    :class="[props.icon, 'px-2 py-1', iconVariant]"
    :data-bs-dismiss="props.dismiss"
    :title="title"
    role="button"
    v-bind="$attrs"
  />

  <button
    v-else
    :class="[
      'btn',
      { 'btn-sm': props.size === 'sm', 'btn-lg': props.size === 'lg' },
      variant,
      'd-flex flex-nowrap gap-1 align-items-center justify-content-center text-nowrap',
    ]"
    :data-bs-dismiss="props.dismiss"
    :title="title"
    :type="type as any"
    v-bind="$attrs"
  >
    <span
      v-if="props.loading"
      class="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    />
    <i v-if="props.icon" :class="props.icon"></i>
    <span v-if="props.label">{{ props.label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, ComputedRef, PropType } from 'vue';
import type { ButtonTypes, Variants } from './types';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  type: {
    type: String as PropType<ButtonTypes>,
    required: false,
    defult: 'button',
  },
  variant: {
    type: String as PropType<Variants>,
    required: false,
    default: 'primary',
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: 'sm',
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
  title: {
    type: String,
    required: false,
    default: undefined,
  },
  icon: {
    type: String,
    required: false,
    default: '',
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  dismiss: {
    type: String,
    required: false,
    default: null,
  },
});

const variant: ComputedRef<string> = computed(() =>
  props.variant ? `btn-${props.variant}` : 'btn-primary',
);

const iconVariant = computed(() => {
  return props.variant
    ? `link-${props.variant} text-${props.variant}`
    : 'link-primary text-primary';
});
</script>
