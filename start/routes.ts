/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel';
import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';

const AccountTypesController = () => import('#controllers/account_types_controller');

router.on('/').renderInertia('home', {}).as('home');

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']);
    router.post('signup', [controllers.NewAccount, 'store']);

    router.get('login', [controllers.Session, 'create']);
    router.post('login', [controllers.Session, 'store']);
  })
  .use(middleware.guest());

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']);

    router.get('account-types', [AccountTypesController, 'index']);
    router.post('account-types', [AccountTypesController, 'store']);
    router.put('account-types/:id', [AccountTypesController, 'update']);
    router.patch('account-types/:id/archive', [AccountTypesController, 'archive']);
  })
  .use(middleware.auth());
