import './css/app.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'vue-sonner/style.css';
import { client } from '~/client';
import { createApp, type DefineComponent, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { createPinia } from 'pinia';
import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { TuyauProvider } from '@adonisjs/inertia/vue';
import * as bootstrap from 'bootstrap';
import Layout from '~/layouts/default.vue';

const appName = import.meta.env.VITE_APP_NAME || 'Fortuna';

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.vue`,
      import.meta.glob<DefineComponent>('./pages/**/*.vue'),
      Layout,
    );
  },
  setup({ el, App, props, plugin }) {
    const pinia = createPinia();

    createApp({ render: () => h(TuyauProvider, { client }, { default: () => h(App, props) }) })
      .use(plugin)
      .use(pinia)
      .mount(el);

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  },
  progress: {
    color: '#4B5563',
  },
});
