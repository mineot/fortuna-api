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
  const clearTitle = () => (title.value = '');

  const buttons = ref<Button[]>([]);
  const clearButtons = () => (buttons.value = []);
  const getButtons = () => buttons.value;

  const setButtons = (values: Button[]) => {
    buttons.value = values;
    setTimeout(() => refreshTooltips(), 500);
  };

  const refreshTooltips = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  };

  function getCsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function getCsrfHeader() {
    const csrfToken = getCsrfToken();

    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
    };
  }

  async function findById<T>(url: string, id: number): Promise<T> {
    const response = await fetch(`${url}/${id}`, {
      headers: { Accept: 'application/json' },
    });

    const json = await response.json();
    return json.data as T;
  }

  return {
    getTitle,
    setTitle,
    clearTitle,
    getButtons,
    setButtons,
    clearButtons,
    refreshTooltips,
    getCsrfToken,
    getCsrfHeader,
    findById,
  };
});
