import '@adonisjs/inertia/types'

import type { VNodeProps, AllowedComponentProps, ComponentInstance } from 'vue'

type ExtractProps<T> = Omit<
  ComponentInstance<T>['$props'],
  keyof VNodeProps | keyof AllowedComponentProps
>

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.vue'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.vue'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.vue'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.vue'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.vue'))['default']>
    'profile': ExtractProps<(typeof import('../../inertia/pages/profile.vue'))['default']>
    'settings': ExtractProps<(typeof import('../../inertia/pages/settings.vue'))['default']>
    'simple_cruds/account-types': ExtractProps<(typeof import('../../inertia/pages/simple_cruds/account-types.vue'))['default']>
    'simple_cruds/budget': ExtractProps<(typeof import('../../inertia/pages/simple_cruds/budget.vue'))['default']>
    'simple_cruds/category.group': ExtractProps<(typeof import('../../inertia/pages/simple_cruds/category.group.vue'))['default']>
    'simple_cruds/payee': ExtractProps<(typeof import('../../inertia/pages/simple_cruds/payee.vue'))['default']>
    'simple_cruds/shopping-list': ExtractProps<(typeof import('../../inertia/pages/simple_cruds/shopping-list.vue'))['default']>
  }
}
