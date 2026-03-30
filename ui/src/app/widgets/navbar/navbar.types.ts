export type MenuDivider = { id: string; type: 'divider' };

export type MenuLink = {
  href: string;
  i18nLabel: string;
  id: string;
  type: 'link';
};

export type MenuCheckbox = {
  change: (event?: Event, item?: MenuCheckbox) => void;
  checked: () => boolean;
  i18nLabel: string;
  id: string;
  type: 'checkbox';
  value: string;
};

export type MenuConfiguration = {
  id: string;
  i18nLabel: string;
  items: MenuDivider[] | MenuLink[] | MenuCheckbox[];
};
