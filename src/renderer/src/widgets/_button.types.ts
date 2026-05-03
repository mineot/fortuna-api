export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export type ButtonProps = {
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  label?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
};
