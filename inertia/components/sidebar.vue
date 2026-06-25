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
      <div class="d-flex flex-column gap-1 align-items-start justify-content-between">
        <div class="d-flex flex-column">
          <span class="fs-4">{{ page.props.user?.fullName ?? '' }}</span>
          <span class="fs-6 text-body-tertiary">{{ page.props.user?.email ?? '' }}</span>
        </div>

        <div class="d-flex gap-2 align-items-center">
          <Link
            class="btn btn-sm btn-secondary"
            :title="t('app.settings.title')"
            route="settings.index"
            @click="closeSidebar()"
          >
            <i class="bi bi-gear-fill"></i>
          </Link>

          <button
            class="btn btn-sm btn-secondary"
            type="button"
            :title="t('app.auth.logout')"
            @click="logout()"
          >
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div>
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
import { Link } from '@adonisjs/inertia/vue';
import { router } from '@inertiajs/vue3';
import { Offcanvas } from 'bootstrap';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import type { Data } from '@generated/data';
import { computed } from 'vue';

type MenuRouteNames = 'home' | 'account_types.index' | 'category_groups.index' | 'settings.index';

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
  {
    route: 'category_groups.index',
    activeRoute: '/category-groups',
    label: 'app.categoryGroups.title',
  },
];

function logout() {
  closeSidebar();

  router.post('/logout');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');

  if (!sidebar) {
    return;
  }

  Offcanvas.getOrCreateInstance(sidebar).hide();
}
</script>
