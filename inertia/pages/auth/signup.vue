<script setup lang="ts">
import { Form } from '@adonisjs/inertia/vue';
import { useI18n } from '../../lib/i18n';

const { t } = useI18n();
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-5">
      <div class="card bg-body border-secondary-subtle">
        <div class="card-body p-4 p-md-5">
          <h1 class="h3 mb-2">{{ t('app.auth.signup') }}</h1>
          <p class="text-secondary mb-4">{{ t('app.auth.signupSubtitle') }}</p>

          <Form route="new_account.store" #default="{ processing, errors }" class="d-grid gap-3">
            <div>
              <label for="fullName" class="form-label">{{ t('app.auth.fullName') }}</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                :class="['form-control', { 'is-invalid': errors.fullName }]"
              />
              <div v-if="errors.fullName" class="invalid-feedback d-block">
                {{ errors.fullName }}
              </div>
            </div>

            <div>
              <label for="email" class="form-label">{{ t('app.auth.email') }}</label>
              <input
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                :class="['form-control', { 'is-invalid': errors.email }]"
              />
              <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
            </div>

            <div>
              <label for="password" class="form-label">{{ t('app.auth.password') }}</label>
              <input
                type="password"
                name="password"
                id="password"
                autocomplete="new-password"
                :class="['form-control', { 'is-invalid': errors.password }]"
              />
              <div v-if="errors.password" class="invalid-feedback d-block">
                {{ errors.password }}
              </div>
            </div>

            <div>
              <label for="passwordConfirmation" class="form-label">{{
                t('app.auth.passwordConfirmation')
              }}</label>
              <input
                type="password"
                name="passwordConfirmation"
                id="passwordConfirmation"
                autocomplete="new-password"
                :class="['form-control', { 'is-invalid': errors.passwordConfirmation }]"
              />
              <div v-if="errors.passwordConfirmation" class="invalid-feedback d-block">
                {{ errors.passwordConfirmation }}
              </div>
            </div>

            <div class="d-grid mt-2">
              <button type="submit" class="btn btn-primary" :disabled="processing">
                {{ processing ? t('app.auth.creatingAccount') : t('app.auth.signup') }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
