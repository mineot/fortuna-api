import { APP_ROUTES_MAP } from '@app/app.routes';
import { MenuConfiguration } from '@widgets/navbar/navbar.types';

export const REGISTERS_MENU: MenuConfiguration = {
  id: 'registers',
  i18nLabel: 'registers.title',
  items: [
    {
      id: 'registers-types',
      i18nLabel: 'registers.types.title',
      type: 'link',
      href: APP_ROUTES_MAP.registers.types,
    },
  ],
};
