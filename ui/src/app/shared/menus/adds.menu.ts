import { APP_ROUTES_MAP } from '@app/app.routes';
import { MenuConfiguration } from '@widgets/navbar/navbar.types';

export const ADDS_MENU: MenuConfiguration = {
  id: 'adds',
  i18nLabel: 'adds.title',
  items: [
    {
      id: 'adds-types',
      i18nLabel: 'adds.types.title',
      type: 'link',
      href: APP_ROUTES_MAP.adds.types,
    },
  ],
};
