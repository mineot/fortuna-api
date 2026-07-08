<template>
  <div class="d-flex flex-column gap-3">
    <Panel>
      <Form ref="formEssential" :rules="rulesEssential" :init-values="initEssential">
        <FormInput name="fullName" type="text" :label="t('app.auth.fullName')" />
        <FormInput name="email" type="email" :label="t('app.auth.email')" />
      </Form>
    </Panel>
    <Panel>
      <Form ref="formPassword" :rules="rulesPassword" :init-values="initPassword">
        <FormInput
          name="currentPassword"
          type="password"
          :label="t('app.profile.currentPassword')"
        />
        <FormInput name="newPassword" type="password" :label="t('app.profile.newPassword')" />
        <FormInput
          name="newPasswordConfirmation"
          type="password"
          :label="t('app.profile.newPasswordConfirmation')"
        />
      </Form>
    </Panel>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { merge, Payload } from '~/helpers/app.helper';
import { toast } from 'vue-sonner';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import Form from '~/components/form/form.vue';
import FormInput from '~/components/form/form-input.vue';
import Panel from '~/components/panel.vue';
import type { Data } from '@generated/data';
import type { FormExposed, RuleObject } from '~/components/form/form.types';

const { t } = useI18n();

const {
  clearButtons,
  clearTitle,
  setButtons,
  setTitle,
  startLoading,
  stopLoading,
  toggleButtonState,
} = useAppStore();

const page = usePage<Data.SharedProps>();
const formEssential = ref<FormExposed | null>(null);
const formPassword = ref<FormExposed | null>(null);
const bothFormsValid = computed(() => formEssential.value?.valid && formPassword.value?.valid);

const rulesEssential: RuleObject = {
  fullName: {
    type: 'text',
    rules: {
      REQUIRED: t('app.auth.fullNameRequired'),
    },
  },
  email: {
    type: 'email',
    rules: {
      REQUIRED: t('app.profile.emailRequired'),
      EMAIL: t('app.auth.emailInvalid'),
    },
  },
};

const initEssential = {
  fullName: page.props.user?.fullName ?? '',
  email: page.props.user?.email ?? '',
};

const rulesPassword: RuleObject = {
  currentPassword: {
    type: 'password',
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
  newPassword: {
    type: 'password',
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
  newPasswordConfirmation: {
    type: 'password',
    rules: {
      WHEN: [
        { field: 'currentPassword', message: t('app.profile.passwordFieldsRequired') },
        { field: 'newPassword', message: t('app.profile.passwordFieldsRequired') },
      ],
      EQUAL: [{ field: 'newPassword', message: t('app.profile.passwordsDoNotMatch') }],
    },
  },
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
          startLoading();
          const essentialValues = await formEssential.value?.getValues();
          const passwordValues = await formPassword.value?.getValues();

          if (!essentialValues || !passwordValues) {
            return;
          }

          const payload: Payload = {
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
        } finally {
          stopLoading();
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
