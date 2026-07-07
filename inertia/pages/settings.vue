<template>
  <Panel>
    <Form
      ref="form"
      :fields="[
        {
          name: 'locale-select',
          type: 'SELECT',
          label: t('app.settings.locale'),
          options: languageOptions({
            enUsLang: t('app.settings.localeEnUs'),
            ptBrLang: t('app.settings.localePtBr'),
          }),
        },
        {
          name: 'currency-select',
          type: 'SELECT',
          label: t('app.settings.currency'),
          options: currencyOptions,
        },
        {
          name: 'timezone-select',
          type: 'SELECT',
          label: t('app.settings.timezone'),
          searchable: true,
          options: timezoneOptions,
        },
      ]"
      :initial-values="{
        'locale-select': locale,
        'currency-select': currency,
        'timezone-select': timezone,
      }"
    />
  </Panel>
</template>

<script setup lang="ts">
import { Data } from '@generated/data';
import { languageOptions, currencyOptions, timezoneOptions } from '~/helpers/app.options';
import { onMounted, onUnmounted, ref } from 'vue';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import Form from '~/components/form.vue';
import Panel from '~/components/panel.vue';

const { t } = useI18n();
const { setTitle, clearTitle, setButtons, clearButtons, startLoading, stopLoading } = useAppStore();
const page = usePage<Data.SharedProps>();
const form = ref<InstanceType<typeof Form> | null>(null);
const { currency, locale, timezone } = page.props.settings as any;

onMounted(() => {
  setTitle(t('app.settings.title'));

  setButtons([
    {
      refId: 'save-profile',
      icon: 'bi bi-floppy-fill',
      title: t('app.terms.save'),
      click: async () => {
        try {
          startLoading();
          const formValues = await form.value?.getValues();

          if (!formValues) {
            return;
          }

          // const payload: Record<string, unknown> = {
          //   fullName: essentialValues.fullName,
          //   email: essentialValues.email,
          //   currentPassword: passwordValues.currentPassword || undefined,
          //   newPassword: passwordValues.newPassword || undefined,
          //   newPasswordConfirmation: passwordValues.newPasswordConfirmation || undefined,
          // };

          // await merge({ url: '/profile', payload, options: { t } });
          // TODO: reload all system
          // toast.success(t('app.profile.successSave'));
        } catch (msg) {
          // toast.error(typeof msg === 'string' ? msg : t('app.terms.error_unexpected'));
        } finally {
          stopLoading();
        }
      },
    },
    {
      refId: 'reset-profile',
      icon: 'bi bi-arrow-clockwise',
      title: t('app.terms.reset'),
      click: () => form.value?.reset(),
    },
  ]);
});

onUnmounted(() => {
  clearTitle();
  clearButtons();
});
</script>
