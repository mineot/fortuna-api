export type ButtonProps = {
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  label?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
};
