<template>
  <div ref="modalEl" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ props.title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div class="modal-footer">
          <button
            v-for="(action, index) in actions"
            :key="index"
            type="button"
            class="btn btn-sm"
            :class="modalVariant(action.variant)"
            :data-bs-dismiss="action.closeModal ? 'modal' : null"
            @click="action.click"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, PropType } from 'vue';
import { Modal } from 'bootstrap';
import { Variants } from './types';

type ModalAction = {
  variant: Variants;
  label: string;
  closeModal: boolean;
  click?: () => void;
};

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  actions: {
    type: Array as PropType<ModalAction[]>,
    required: true,
  },
});

const emit = defineEmits(['close']);

const modalEl = ref<any>(null);
const modalIns = ref<any>(null);
const modalVariant = (variant: Variants) => `btn-${variant}`;

onMounted(() => {
  if (modalEl.value) {
    modalIns.value = new Modal(modalEl.value, {
      backdrop: 'static',
      keyboard: true,
    });

    modalEl.value.addEventListener('hidden.bs.modal', () => {
      emit('close');
    });
  }
});

watch(
  () => props.show,
  (value: boolean) => {
    if (value) {
      modalIns.value.show();
    } else {
      modalIns.value.hide();
    }
  },
);

onBeforeUnmount(() => {
  if (modalIns) {
    modalIns.value.dispose();
  }
});
</script>
