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
    <div class="offcanvas-body d-flex flex-column gap-3 pt-0">
      <div
        class="d-flex flex-column gap-2 align-items-start justify-content-between border rounded px-3 py-2 bg-dark-subtle"
      >
        <div class="d-flex flex-column">
          <span class="fs-5">{{ page.props.user?.fullName ?? '' }}</span>
          <small class="text-body-tertiary">{{ page.props.user?.email ?? '' }}</small>
        </div>

        <div class="d-flex gap-2 align-items-center justify-content-end">
          <Link
            :class="['btn btn-sm', { 'btn-dark': !isProfile, 'btn-light': isProfile }]"
            :title="t('app.profile.title')"
            @click="closeSidebar()"
            route="profile.index"
          >
            <i class="bi bi-person-fill"></i>
          </Link>

          <Link
            :class="['btn btn-sm', { 'btn-dark': !isSettings, 'btn-light': isSettings }]"
            :title="t('app.settings.title')"
            route="settings.index"
            @click="closeSidebar()"
          >
            <i class="bi bi-gear-fill"></i>
          </Link>

          <button
            class="btn btn-sm btn-dark"
            type="button"
            :title="t('app.auth.logout')"
            @click="logout()"
          >
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>

      <div class="d-flex flex-column gap-2 border rounded px-4 py-3 bg-dark-subtle">
        <Link
          v-for="menu in menuItems"
          :key="menu.activeRoute"
          :route="menu.route"
          @click="closeSidebar()"
          aria-current="true"
          class="link-secondary text-decoration-none ps-2"
          role="button"
          :class="{
            'link-light': currentPage === menu.activeRoute,
            'border-start border-2 border-light': currentPage === menu.activeRoute,
          }"
        >
          <span>{{ t(menu.label) }}</span>
        </Link>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@adonisjs/inertia/vue';
import { Offcanvas } from 'bootstrap';
import { router } from '@inertiajs/vue3';
import { useI18n } from '~/lib/i18n';
import { usePage } from '@inertiajs/vue3';
import type { Data } from '@generated/data';

type MenuRouteNames = 'home' | 'account_types.index' | 'category_groups.index' | 'settings.index';

type MenuItem = {
  route: MenuRouteNames;
  activeRoute: string;
  label: string;
};

const { t } = useI18n();

const page = usePage<Data.SharedProps>();
const currentPage = computed(() => page.url);
const isProfile = computed(() => page.url === '/profile');
const isSettings = computed(() => page.url === '/settings');

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

  if (sidebar) {
    Offcanvas.getOrCreateInstance(sidebar).hide();
  }
}
</script>
