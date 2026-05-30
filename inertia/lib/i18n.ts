import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { Data } from '@generated/data';

type Dict = Record<string, string>;

export function useI18n() {
  const page = usePage<Data.SharedProps & { locale?: string; messages?: Dict }>();

  const locale = computed(() => page.props.locale ?? 'en-US');
  const messages = computed(() => (page.props.messages ?? {}) as Dict);

  const t = (key: string) => messages.value[key] ?? key;

  return { locale, t };
}
