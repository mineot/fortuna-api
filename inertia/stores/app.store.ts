import { defineStore } from 'pinia';
import { ref } from 'vue';

type Button = {
  icon: string;
  title: string;
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
  };
});
