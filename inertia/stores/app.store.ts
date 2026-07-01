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

  // FIXME: transfer to helper class
  function getCsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  // FIXME: transfer to helper class
  function getCsrfHeader() {
    const csrfToken = getCsrfToken();

    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
    };
  }

  // FIXME: transfer to helper class
  async function findById<T>(url: string, id: number): Promise<T> {
    const response = await fetch(`${url}/${id}`, {
      headers: { Accept: 'application/json' },
    });

    const json = await response.json();
    return json.data as T;
  }

  // FIXME: transfer to helper class
  async function archive(url: string, id: number): Promise<{ fail: boolean; message?: any }> {
    try {
      const response = await fetch(`${url}/${id}/archive`, {
        method: 'PATCH',
        credentials: 'include',
        headers: getCsrfHeader(),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        return { fail: true, message: body.message };
      }

      return { fail: false };
    } catch {
      throw null;
    }
  }

  return {
    getTitle,
    setTitle,
    clearTitle,
    getButtons,
    setButtons,
    clearButtons,
    getCsrfToken,
    getCsrfHeader,
    findById,
    archive,
    isLoading,
    setLoading,
  };
});
