<template>
  <Panel>
    <Form v-if="page.props.settings" ref="form" :init-values="initValues">
      <SelectForm name="locale" :label="t('app.settings.locale')" :options="langOptions" />
      <SelectForm name="currency" :label="t('app.settings.currency')" :options="currencyOptions" />
      <SelectForm name="timezone" :label="t('app.settings.timezone')" :options="timezoneOptions" />
    </Form>
  </Panel>
</template>

<script setup lang="ts">
import { Data } from '@generated/data';
import { languageOptions, currencyOptions, timezoneOptions } from '~/helpers/app.options';
import { onMounted, onUnmounted, ref } from 'vue';
import { SelectOption } from '~/components/form/form.types';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import Form from '~/components/form/form.vue';
import Panel from '~/components/panel.vue';
import SelectForm from '~/components/form/form-select.vue';
import { toast } from 'vue-sonner';
import { merge, Payload } from '~/helpers/app.helper';

const { t } = useI18n();
const { setTitle, clearTitle, setButtons, clearButtons, startLoading, stopLoading } = useAppStore();

const form = ref<InstanceType<typeof Form> | null>(null);
const page = usePage<Data.SharedProps>();

const langOptions: SelectOption[] = languageOptions({
  enUsLang: t('app.settings.localeEnUs'),
  ptBrLang: t('app.settings.localePtBr'),
});

const { currency, locale, timezone } = page.props.settings as Data.Settings;

const initValues: Pick<Data.Settings, 'locale' | 'currency' | 'timezone'> = {
  locale: locale,
  currency: currency,
  timezone: timezone,
};

onMounted(() => {
  setTitle(t('app.settings.title'));

  setButtons([
    {
      refId: 'save-settings',
      icon: 'bi bi-floppy-fill',
      title: t('app.terms.save'),
      click: async () => {
        try {
          startLoading();
          const values = await form.value?.getValues();

          if (!values) {
            return;
          }

          const payload: Payload = {
            locale: values.locale,
            currency: values.currency,
            timezone: values.timezone,
          };

          const updated: Data.Settings = await merge<Data.Settings>({
            url: '/settings',
            payload,
            options: { t },
          });

          if (page.props.settings && updated) {
            page.props.settings = {
              ...page.props.settings,
              locale: updated.locale,
              currency: updated.currency,
              timezone: updated.timezone,
              updatedAt: updated.updatedAt,
            } as Data.Settings;
          }

          // TODO: precisamos achar um jeito de atualizar o sistema, pois se mudarmos o idioma tem que refletir essa mudança
          toast.success(t('app.settings.successSave'));
        } catch (msg) {
          toast.error(typeof msg === 'string' ? msg : t('app.terms.error_unexpected'));
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
