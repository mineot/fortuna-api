import { APP_ROUTES_MAP } from '@app/app.routes';
import { MenuConfiguration } from '@widgets/navbar/navbar.types';

export const CONFIGS_MENU: MenuConfiguration = {
  id: 'configs',
  i18nLabel: 'configs.title',
  items: [
    {
      id: 'langs',
      i18nLabel: 'configs.languages.title',
      type: 'link',
      href: APP_ROUTES_MAP.configurations.languages,
    },
  ],
};
