<!--
  TODO: Instalar Luxon (ou date-fns) no frontend para formatar datas com locale + timezone do usuário
  TODO: Expor o timezone do usuário nas shared props do Inertia (inertia_middleware.ts)
  TODO: Padronizar archivedAt para DateTime.utc() em vez de DateTime.now() nos 19 controllers (todas as datas dos controllers)
  TODO: Validar timezone com uma lista IANA completa vinda do backend (ou Intl.supportedValuesOf)
  TODO: Usar vine.date() nos validators em vez de vine.string() para campos de data
  TODO: Parsear input de data do usuário no fuso dele (DateTime.fromISO(value, { zone: userTimezone }))
  TODO: Converter datas que vêm da API para o timezone do usuário antes de exibir
-->
<template>
  <section class="p-4 p-md-5 mb-4 bg-body rounded-3 border border-secondary-subtle">
    <div class="container-fluid py-2">
      <div class="row">
        <div class="col-12 col-md-8 col-lg-6">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label for="locale" class="form-label">{{ t('app.settings.locale') }}</label>
              <select id="locale" v-model="form.locale" class="form-select">
                <option value="en-US">{{ t('app.settings.localeEnUs') }}</option>
                <option value="pt-BR">{{ t('app.settings.localePtBr') }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="currency" class="form-label">{{ t('app.settings.currency') }}</label>
              <input id="currency" v-model="form.currency" type="text" class="form-control" maxlength="10" />
            </div>

            <div class="mb-3">
              <label for="timezone" class="form-label">{{ t('app.settings.timezone') }}</label>
              <select id="timezone" v-model="form.timezone" class="form-select">
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Chicago">America/Chicago</option>
                <option value="America/Denver">America/Denver</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                <option value="America/Buenos_Aires">America/Buenos_Aires</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Europe/Lisbon">Europe/Lisbon</option>
                <option value="Africa/Cairo">Africa/Cairo</option>
                <option value="Asia/Dubai">Asia/Dubai</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Asia/Shanghai">Asia/Shanghai</option>
                <option value="Pacific/Auckland">Pacific/Auckland</option>
              </select>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1" role="status"></span>
                {{ t('app.terms.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { toast } from 'vue-sonner';
import { usePage } from '@inertiajs/vue3';
import { useI18n } from '~/lib/i18n';
import { useAppStore } from '~/stores/app.store';
import type { Data } from '@generated/data';

const { t } = useI18n();
const { setTitle } = useAppStore();
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

const saving = ref(false);

async function onSubmit() {
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
}

onMounted(() => {
  setTitle(t('app.settings.title'));
});
</script>
