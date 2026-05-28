<script setup lang="ts">
import { watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast, Toaster } from 'vue-sonner'
import type { Data } from '@generated/data'
import { Link, Form } from '@adonisjs/inertia/vue'

const page = usePage<Data.SharedProps>()

watch(
  () => page.url,
  () => toast.dismiss()
)

watch(
  () => page.props.flash,
  (flashMessages) => {
    if (flashMessages.error) {
      toast.error(flashMessages.error)
    }
    if (flashMessages.success) {
      toast.success(flashMessages.success)
    }
  },
  { immediate: true }
)
</script>

<template>
  <header class="navbar navbar-expand-lg bg-body border-bottom border-secondary-subtle">
    <div class="container">
      <Link route="home" class="navbar-brand fw-semibold brand-logo">FORTUNA</Link>
      <nav class="ms-auto d-flex align-items-center gap-3">
          <template v-if="page.props.user">
            <span class="badge text-bg-secondary">{{ page.props.user.initials }}</span>
            <Form route="session.destroy">
              <button type="submit" class="btn btn-outline-light btn-sm">
                <i class="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </Form>
          </template>
          <template v-else>
            <Link route="new_account.create" class="btn btn-outline-light btn-sm">
              <i class="bi bi-person-plus me-1"></i>
              Signup
            </Link>
            <Link route="session.create" class="btn btn-primary btn-sm">
              <i class="bi bi-box-arrow-in-right me-1"></i>
              Login
            </Link>
          </template>
      </nav>
    </div>
  </header>

  <main class="app-shell py-4">
    <div class="container">
      <slot />
    </div>
  </main>

  <Toaster position="top-center" rich-colors />
</template>
