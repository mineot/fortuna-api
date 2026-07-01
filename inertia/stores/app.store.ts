import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('appStore', () => {
  type Button = {
    icon: string;
    title: string;
    click: (event?: any) => void;
  };

  const loading = ref<boolean>(false);
  const isLoading = () => loading.value;
  const setLoading = (value: boolean) => (loading.value = value);

  const title = ref<string>('');
  const getTitle = () => title.value;
  const setTitle = (value: string) => (title.value = value);
  const clearTitle = () => (title.value = '');

  const buttons = ref<Button[]>([]);
  const clearButtons = () => (buttons.value = []);
  const getButtons = () => buttons.value;

  const setButtons = (values: Button[]) => {
    buttons.value = values;
  };

  return {
    getTitle,
    setTitle,
    clearTitle,
    getButtons,
    setButtons,
    clearButtons,
    isLoading,
    setLoading,
  };
});
