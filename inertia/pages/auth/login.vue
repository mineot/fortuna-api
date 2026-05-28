<script setup lang="ts">
import { Form } from '@adonisjs/inertia/vue'
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-5">
      <div class="card bg-body border-secondary-subtle">
        <div class="card-body p-4 p-md-5">
          <h1 class="h3 mb-2">Login</h1>
          <p class="text-secondary mb-4">Enter your details to access your account.</p>

          <Form route="session.store" #default="{ processing, errors }" class="d-grid gap-3">
            <div>
              <label for="email" class="form-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            autocomplete="username"
            :class="['form-control', { 'is-invalid': errors.email }]"
          />
              <div v-if="errors.email" class="invalid-feedback d-block">{{ errors.email }}</div>
            </div>

            <div>
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                autocomplete="current-password"
                :class="['form-control', { 'is-invalid': errors.password }]"
              />
              <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
            </div>

            <div class="d-grid mt-2">
              <button type="submit" class="btn btn-primary" :disabled="processing">
                {{ processing ? 'Signing in...' : 'Login' }}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
