<template>
  <section class="d-flex flex-column gap-4">
    <div class="card bg-body border-secondary-subtle">
      <div class="card-body">
        <h5 class="card-title mb-3">{{ t('app.profile.profileInfo') }}</h5>
        <div class="d-flex flex-column gap-3">
          <FormControl type="text" v-model="form.fullName" :label="t('app.auth.fullName')" />

          <FormControl
            type="email"
            v-model="form.email"
            name="email"
            :label="t('app.auth.email')"
            :errors="errors"
            required
          />
        </div>
      </div>
    </div>

    <div class="card bg-body border-secondary-subtle">
      <div class="card-body">
        <h5 class="card-title mb-3">{{ t('app.profile.changePassword') }}</h5>
        <div class="d-flex flex-column gap-3">
          <FormControl
            type="password"
            v-model="form.currentPassword"
            :label="t('app.profile.currentPassword')"
          />

          <FormControl
            type="password"
            v-model="form.newPassword"
            :label="t('app.profile.newPassword')"
          />

          <FormControl
            type="password"
            v-model="form.newPasswordConfirmation"
            name="newPasswordConfirmation"
            :label="t('app.profile.newPasswordConfirmation')"
            :errors="errors"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useAppStore } from '~/stores/app.store';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import FormControl from '~/components/form-control.vue';
import type { Data } from '@generated/data';

const { getCsrfHeader, setLoading } = useAppStore();
const { setTitle, setButtons, clearTitle, clearButtons } = useAppStore();
const { t } = useI18n();

const page = usePage<Data.SharedProps & { user: UserProps }>();

type UserProps = {
  id: number;
  fullName: string | null;
  email: string;
};

const errors = reactive<Record<string, string | undefined>>({});

const form = reactive({
  fullName: page.props.user.fullName ?? '',
  email: page.props.user.email,
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
});

watch(
  () => form.newPasswordConfirmation,
  () => {
    errors.newPasswordConfirmation = undefined;
  },
);

watch(
  () => form.email,
  () => {
    errors.email = undefined;
  },
);

onMounted(() => {
  setTitle(t('app.profile.title'));

  setButtons([
    {
      title: t('app.terms.save'),
      icon: 'bi bi-floppy-fill',
      click: async () => {
        setLoading(true);

        const hasNewPassword = !!form.newPassword;

        if (!form.email.trim()) {
          errors.email = t('app.profile.emailRequired');
          setLoading(false);
          return;
        }

        if (hasNewPassword && form.newPassword !== form.newPasswordConfirmation) {
          errors.newPasswordConfirmation = t('app.profile.passwordsDoNotMatch');
          setLoading(false);
          return;
        }

        errors.newPasswordConfirmation = undefined;

        const payload: Record<string, unknown> = {
          fullName: form.fullName || null,
          email: form.email,
          currentPassword: form.currentPassword || undefined,
        };

        if (hasNewPassword) {
          payload.newPassword = form.newPassword;
          payload.newPasswordConfirmation = form.newPasswordConfirmation;
        }

        try {
          const response = await fetch('/profile', {
            method: 'PUT',
            credentials: 'include',
            headers: getCsrfHeader(),
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            const msg = body.errors?.[0]?.message || body.message || t('app.terms.error_occurred');
            toast.error(msg);
            return;
          }

          form.currentPassword = '';
          form.newPassword = '';
          form.newPasswordConfirmation = '';

          toast.success(t('app.profile.successSave'));
        } catch {
          toast.error(t('app.terms.error_unexpected'));
        } finally {
          setLoading(false);
        }
      },
    },
  ]);
});

onUnmounted(() => {
  clearTitle();
  clearButtons();
});
</script>
