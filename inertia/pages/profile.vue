<template>
  <div class="d-flex flex-column gap-3">
    <Panel>
      <Form
        ref="formEssential"
        :init-values="initEssential"
        :fields="[
          {
            name: 'fullName',
            label: t('app.auth.fullName'),
            type: 'TEXT',
            rules: {
              REQUIRED: t('app.auth.fullNameRequired'),
            },
          },
          {
            name: 'email',
            label: t('app.auth.email'),
            type: 'EMAIL',
            rules: {
              REQUIRED: t('app.profile.emailRequired'),
              EMAIL: t('app.auth.emailInvalid'),
            },
          },
        ]"
      />
    </Panel>

    <Panel>
      <Form
        ref="formPassword"
        :init-values="initPassword"
        :fields="[
          {
            name: 'currentPassword',
            label: t('app.profile.currentPassword'),
            type: 'PASSWORD',
            rules: {
              WHEN: [
                { field: 'newPassword', message: t('app.profile.passwordFieldsRequired') },
                {
                  field: 'newPasswordConfirmation',
                  message: t('app.profile.passwordFieldsRequired'),
                },
              ],
            },
          },
          {
            name: 'newPassword',
            label: t('app.profile.newPassword'),
            type: 'PASSWORD',
            rules: {
              WHEN: [
                { field: 'currentPassword', message: t('app.profile.passwordFieldsRequired') },
                {
                  field: 'newPasswordConfirmation',
                  message: t('app.profile.passwordFieldsRequired'),
                },
              ],
            },
          },
          {
            name: 'newPasswordConfirmation',
            label: t('app.profile.newPasswordConfirmation'),
            type: 'PASSWORD',
            rules: {
              WHEN: [
                { field: 'currentPassword', message: t('app.profile.passwordFieldsRequired') },
                { field: 'newPassword', message: t('app.profile.passwordFieldsRequired') },
              ],
              EQUAL: [{ field: 'newPassword', message: t('app.profile.passwordsDoNotMatch') }],
            },
          },
        ]"
      />
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { merge } from '~/helpers/app.helper';
import { toast } from 'vue-sonner';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import Form, { type FormExposed } from '~/components/form.vue';
import Panel from '~/components/panel.vue';
import type { Data } from '@generated/data';

const { t } = useI18n();
const { setTitle, clearTitle, setButtons, clearButtons, toggleButtonState } = useAppStore();

const page = usePage<Data.SharedProps>();
const formEssential = ref<FormExposed | null>(null);
const formPassword = ref<FormExposed | null>(null);
const bothFormsValid = computed(() => formEssential.value?.valid && formPassword.value?.valid);

const initEssential = {
  fullName: page.props.user?.fullName ?? '',
  email: page.props.user?.email ?? '',
};

const initPassword = {
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};

watch(
  bothFormsValid,
  (valid) => {
    toggleButtonState('save-profile', valid ? 'enable' : 'disable');
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  setTitle(t('app.profile.title'));

  setButtons([
    {
      refId: 'save-profile',
      icon: 'bi bi-floppy-fill',
      title: t('app.terms.save'),
      disabled: true,
      click: async () => {
        try {
          const essentialValues = await formEssential.value?.getValues();
          const passwordValues = await formPassword.value?.getValues();

          if (!essentialValues || !passwordValues) {
            return;
          }

          const payload: Record<string, unknown> = {
            fullName: essentialValues.fullName,
            email: essentialValues.email,
            currentPassword: passwordValues.currentPassword || undefined,
            newPassword: passwordValues.newPassword || undefined,
            newPasswordConfirmation: passwordValues.newPasswordConfirmation || undefined,
          };

          await merge({ url: '/profile', payload, options: { t } });
          formPassword.value?.reset();
          toast.success(t('app.profile.successSave'));
        } catch (msg) {
          toast.error(typeof msg === 'string' ? msg : t('app.terms.error_unexpected'));
        }
      },
    },
    {
      refId: 'reset-profile',
      icon: 'bi bi-arrow-clockwise',
      title: t('app.terms.reset'),
      click: () => {
        formEssential.value?.reset();
        formPassword.value?.reset();
      },
    },
  ]);
});

onUnmounted(() => {
  clearTitle();
  clearButtons();
});
</script>
