<template>
  <Modal
    :title="props.title"
    :show="props.show"
    @close="emit('close')"
    :actions="[
      {
        variant: 'secondary',
        label: t('app.terms.no'),
        closeModal: true,
        click: () => emit('cancel'),
      },
      {
        variant: confirmVariant,
        label: t('app.terms.yes'),
        closeModal: true,
        click: () => emit('confirm'),
      },
    ]"
  >
    <span>{{ props.message }}</span>
  </Modal>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { useI18n } from '~/lib/i18n';
import Modal from './modal.vue';

const { t } = useI18n();

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String as PropType<'confirm' | 'remove'>,
    default: 'confirm',
  },
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  close: [];
}>();

const confirmVariant = computed(() => (props.type === 'remove' ? 'danger' : 'primary'));
</script>
