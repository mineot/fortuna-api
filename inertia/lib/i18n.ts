import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { Data } from '@generated/data';

type Dict = Record<string, string>;
type TranslationParam = string | number;

export function useI18n() {
  const page = usePage<
    Data.SharedProps & { locale?: string; messages?: Dict; allMessages?: Record<string, Dict> }
  >();

  const locale = computed(() => page.props.locale ?? 'en-US');
  const allMessages = computed(() => (page.props.allMessages ?? {}) as Record<string, Dict>);
  const messages = computed<Dict>(
    () => allMessages.value[locale.value] ?? page.props.messages ?? {},
  );

  const t = (key: string, params: TranslationParam[] = []) => {
    let message = messages.value[key] ?? key;

    params.forEach((param, index) => {
      message = message.replaceAll(`{${index}}`, String(param));
    });

    return message;
  };

  return { locale, t };
}
