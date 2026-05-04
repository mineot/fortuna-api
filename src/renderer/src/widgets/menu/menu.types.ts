export type MenuItem = {
  key: string;
  label: string;
  icon: string;
  to: string;
};

export type MenuProps = {
  items: MenuItem[];
};
