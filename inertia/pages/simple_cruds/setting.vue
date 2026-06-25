<template>
  <section class="d-flex flex-column gap-3">
    <FormControl
      type="select"
      v-model="form.locale"
      :label="t('app.settings.locale')"
      :options="[
        { label: t('app.settings.localeEnUs'), value: 'en-US' },
        { label: t('app.settings.localePtBr'), value: 'pt-BR' },
      ]"
    />

    <FormControl
      type="select"
      v-model="form.currency"
      :label="t('app.settings.currency')"
      :options="[
        { label: 'USD', value: 'USD' },
        { label: 'BRL', value: 'BRL' },
      ]"
    />

    <FormControl
      type="select"
      v-model="form.timezone"
      :label="t('app.settings.timezone')"
      :options="timezones"
      searchable
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import FormControl from '~/components/form-control.vue';
import type { Data } from '@generated/data';
import { SelectOption } from '~/components/types';

const { t } = useI18n();
const { setTitle, setButtons } = useAppStore();
const { getCsrfHeader } = useAppStore();

const page = usePage<Data.SharedProps & { setting: SettingProps }>();

type SettingProps = {
  id: number;
  userId: number;
  locale: string;
  currency: string;
  timezone: string;
};

const form = reactive<SettingProps>({
  id: page.props.setting.id,
  userId: page.props.setting.userId,
  locale: page.props.setting.locale,
  currency: page.props.setting.currency,
  timezone: page.props.setting.timezone,
});

const timezones: SelectOption[] = [
  { label: 'UTC', value: 'UTC' },
  ...Intl.supportedValuesOf('timeZone').map((tz) => ({
    label: tz,
    value: tz,
  })),
];

const saving = ref(false);

onMounted(() => {
  setTitle(t('app.settings.title'));

  setButtons([
    {
      title: t('app.terms.save'),
      icon: 'bi bi-floppy-fill',
      click: async () => {
        saving.value = true;

        try {
          const response = await fetch('/settings', {
            method: 'PUT',
            credentials: 'include',
            headers: getCsrfHeader(),
            body: JSON.stringify({
              locale: form.locale,
              currency: form.currency,
              timezone: form.timezone,
            }),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            toast.error(body.message || t('app.terms.error_occurred'));
            return;
          }

          toast.success(t('app.settings.successSave'));
        } catch {
          toast.error(t('app.terms.error_unexpected'));
        } finally {
          saving.value = false;
        }
      },
    },
  ]);
});
</script>
