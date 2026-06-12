<template>
  <button :type="type" class="btn btn-sm" :class="variant" v-bind="$attrs">
    <div class="d-flex flex-nowrap gap-1">
      <i v-if="icon" class="bi" :class="icon"></i>
      <span v-if="props.label">{{ props.label }}</span>
    </div>
  </button>
</template>

<style scoped></style>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { PropType } from 'vue';
import type { ButtonTypes, Variants } from './types';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  type: {
    type: String as PropType<ButtonTypes>,
    required: false,
  },
  variant: {
    type: String as PropType<Variants>,
    required: false,
  },
  label: {
    type: String as PropType<string>,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
});

const type: ComputedRef<ButtonTypes> = computed(() => props.type ?? 'button');

const variant: ComputedRef<string> = computed(() =>
  props.variant ? `btn-${props.variant}` : 'btn-primary',
);

const icon: ComputedRef<string | undefined> = computed(() =>
  props.icon ? `bi-${props.icon}` : undefined,
);
</script>
