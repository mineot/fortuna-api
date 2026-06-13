import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as bootstrap from 'bootstrap';

export const useAppStore = defineStore('appStore', () => {
  type Button = {
    icon: string;
    title: string;
    click: (event?: any) => void;
  };

  const title = ref<string>('');
  const getTitle = () => title.value;
  const setTitle = (value: string) => (title.value = value);

  const buttons = ref<Button[]>([]);
  const getButtons = () => buttons.value;
  const setButtons = (values: Button[]) => {
    buttons.value = values;
    setTimeout(() => refreshTooltips(), 500);
  };
  const clearButtons = () => (buttons.value = []);

  const refreshTooltips = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  };

  return { getTitle, setTitle, getButtons, setButtons, clearButtons, refreshTooltips };
});
