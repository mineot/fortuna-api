<template>
  <button
    :type="type"
    class="btn"
    :class="classes"
    v-bind="$attrs"
    data-bs-toggle="tooltip"
    :data-bs-title="title"
  >
    <div class="d-flex flex-nowrap gap-1">
      <i v-if="icon" class="bi" :class="icon"></i>
      <span v-if="props.label">{{ props.label }}</span>
    </div>
  </button>
</template>

<style scoped></style>

<script setup lang="ts">
import { computed, ComputedRef, nextTick, PropType, watch } from 'vue';
import { useAppStore } from '~/stores/app.store';
import type { ButtonTypes, Variants } from './types';

defineOptions({
  inheritAttrs: false,
});

const { refreshTooltips } = useAppStore();

const props = defineProps({
  type: {
    type: String as PropType<ButtonTypes>,
    required: false,
  },
  variant: {
    type: String as PropType<Variants>,
    required: false,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
  },
  label: {
    type: String as PropType<string>,
    required: false,
  },
  title: {
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

const size: ComputedRef<string> = computed(() => {
  if (props.size) {
    if (props.size === 'md') {
      return '';
    }

    return `btn-${props.size}`;
  }
  return 'btn-sm';
});

const classes: ComputedRef<string> = computed(() => `${size.value} ${variant.value}`.trim());

const icon: ComputedRef<string | undefined> = computed(() =>
  props.icon ? `bi-${props.icon}` : undefined,
);

const title = computed(() => props.title ?? '');

watch(title, async () => {
  await nextTick();
  refreshTooltips();
});
</script>
