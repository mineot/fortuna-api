<template>
  <aside
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
    <div class="offcanvas-body d-flex flex-column gap-4 pt-0">
      <div class="d-flex gap-2 align-items-center justify-content-between">
        <div class="d-flex flex-column">
          <span class="fs-4">{{ page.props.user?.fullName ?? '' }}</span>
          <span class="fs-6 text-body-tertiary">{{ page.props.user?.email ?? '' }}</span>
        </div>

        <Form route="session.destroy" class="">
          <button type="submit" class="btn btn-sm btn-secondary" @click="closeSidebar()">
            <i class="bi bi-box-arrow-right me-1"></i>
            {{ t('app.auth.logout') }}
          </button>
        </Form>
      </div>

      <div class="d-flex flex-column gap-2">
        <Link
          v-for="menu in menuItems"
          :class="{
            'link-light': currentPage === menu.activeRoute,
            'border-start border-2 border-light': currentPage === menu.activeRoute,
          }"
          :key="menu.activeRoute"
          :route="menu.route"
          @click="closeSidebar()"
          aria-current="true"
          class="link-secondary text-decoration-none ps-2"
          role="button"
        >
          <span>{{ t(menu.label) }}</span>
        </Link>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Link, Form } from '@adonisjs/inertia/vue';
import { Offcanvas } from 'bootstrap';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import type { Data } from '@generated/data';
import { computed } from 'vue';

type MenuRouteNames = 'home' | 'account_types.index';

type MenuItem = {
  route: MenuRouteNames;
  activeRoute: string;
  label: string;
};

const page = usePage<Data.SharedProps>();
const { t } = useI18n();

const currentPage = computed(() => page.url);

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

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');

  if (!sidebar) {
    return;
  }

  Offcanvas.getOrCreateInstance(sidebar).hide();
}
</script>
