import { defineStore } from 'pinia';
import { ref } from 'vue';

type Button = {
  refId: string;
  icon: string;
  title: string;
  disabled?: boolean;
  click: (event?: any) => void;
};

export const useAppStore = defineStore('appStore', () => {
  const buttons = ref<Button[]>([]);
  const loading = ref<boolean>(false);
  const title = ref<string>('');

  const isLoading = () => {
    return loading.value === true;
  };

  const startLoading = () => {
    loading.value = true;
  };

  const stopLoading = () => {
    loading.value = false;
  };

  const clearTitle = () => {
    title.value = '';
  };

  const getTitle = () => {
    return title.value;
  };

  const setTitle = (value: string) => {
    title.value = value;
  };

  const clearButtons = () => {
    buttons.value = [];
  };

  const getButtons = () => {
    return buttons.value;
  };

  const setButtons = (values: Button[]) => {
    buttons.value = values;
  };

  const toggleButtonState = (refId: string, state: 'enable' | 'disable') => {
    const button = buttons.value.find((btn) => btn.refId === refId);

    if (button) {
      button.disabled = state === 'disable';
    }
  };

  return {
    isLoading,
    startLoading,
    stopLoading,
    clearTitle,
    getTitle,
    setTitle,
    clearButtons,
    getButtons,
    setButtons,
    toggleButtonState,
  };
});
