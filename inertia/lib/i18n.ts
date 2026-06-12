import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { Data } from '@generated/data';

type Dict = Record<string, string>;
type TranslationParam = string | number;

export function useI18n() {
  const page = usePage<Data.SharedProps & { locale?: string; messages?: Dict }>();

  const locale = computed(() => page.props.locale ?? 'en-US');
  const messages = computed(() => (page.props.messages ?? {}) as Dict);

  const t = (key: string, params: TranslationParam[] = []) => {
    let message = messages.value[key] ?? key;

    params.forEach((param, index) => {
      message = message.replaceAll(`{${index}}`, String(param));
    });

    return message;
  };

  return { locale, t };
}
