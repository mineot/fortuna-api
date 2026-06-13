<template>
  <section class="app-shell">
    <Navbar />
    <main class="container-fluid">
      <slot />
    </main>
  </section>

  <template v-if="page.props.user">
    <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      id="sidebar"
      aria-labelledby="sidebarLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="sidebarLabel">{{ t('app.brand') }}</h5>

        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body d-flex flex-column gap-4">
        <div class="d-flex gap-2 align-items-center justify-content-between">
          <div class="d-flex flex-column">
            <span class="fs-4">{{ page.props.user.fullName }}</span>
            <span class="fs-6 text-body-tertiary">{{ page.props.user.email }}</span>
          </div>

          <Form route="session.destroy" class="">
            <button type="submit" class="btn btn-sm btn-secondary" @click="closeSidebar()">
              <i class="bi bi-box-arrow-right me-1"></i>
              {{ t('app.auth.logout') }}
            </button>
          </Form>
        </div>

        <div>
          <div class="list-group list-group-flush">
            <Link
              v-for="menu in menuItems"
              :class="{ active: isActive(menu.activeRoute) }"
              :key="menu.activeRoute"
              :route="menu.route"
              @click="closeSidebar()"
              aria-current="true"
              class="list-group-item list-group-item-action list-group-item-secondary"
            >
              {{ t(menu.label) }}
            </Link>
          </div>
        </div>
      </div>
    </div>
  </template>

  <Toaster position="top-center" rich-colors />
</template>

<script setup lang="ts">
import { Link, Form } from '@adonisjs/inertia/vue';
import { Offcanvas } from 'bootstrap';
import { toast, Toaster } from 'vue-sonner';
import { useI18n } from '../lib/i18n';
import { usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import Navbar from '~/components/navbar.vue';
import type { Data } from '@generated/data';

const page = usePage<Data.SharedProps>();
const { t } = useI18n();
const isActive = (url: string) => page.url === url;

watch(
  () => page.url,
  () => toast.dismiss(),
);

watch(
  () => page.props.flash,
  (flashMessages) => {
    if (flashMessages.error) {
      toast.error(flashMessages.error);
    }

    if (flashMessages.success) {
      toast.success(flashMessages.success);
    }
  },
  { immediate: true },
);

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');

  if (!sidebar) {
    return;
  }

  Offcanvas.getOrCreateInstance(sidebar).hide();
}

type MenuRouteNames = 'home' | 'account_types.index';

type MenuItem = {
  route: MenuRouteNames;
  activeRoute: string;
  label: string;
};

const menuItems: MenuItem[] = [
  {
    route: 'home',
    activeRoute: '/',
    label: 'app.home.title',
  },
  {
    route: 'account_types.index',
    activeRoute: '/account-types',
    label: 'app.accountTypes.title',
  },
];
</script>
