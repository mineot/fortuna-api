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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Data } from '@generated/data';
import { languageOptions, currencyOptions, timezoneOptions } from '~/helpers/app.options';
import { merge, Payload } from '~/helpers/app.helper';
import { SelectOption } from '~/components/form/form.types';
import { toast } from 'vue-sonner';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import Form from '~/components/form/form.vue';
import Panel from '~/components/panel.vue';
import SelectForm from '~/components/form/form-select.vue';

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

const pageTitle = computed(() => t('app.settings.title'));

watch(pageTitle, setTitle, { immediate: true });

onMounted(() => {
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

          const updated = await merge<{
            settings: Data.Settings;
            locale: string;
            messages: Record<string, string>;
          }>({
            url: '/settings',
            payload,
            options: { t },
          });

          if (updated) {
            if (page.props.settings && updated.settings) {
              page.props.settings = {
                ...page.props.settings,
                locale: updated.settings.locale,
                currency: updated.settings.currency,
                timezone: updated.settings.timezone,
                updatedAt: updated.settings.updatedAt,
              } as Data.Settings;
            }

            if (updated.locale && updated.messages) {
              page.props.locale = updated.locale;
              page.props.messages = updated.messages;
            }
          }

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
