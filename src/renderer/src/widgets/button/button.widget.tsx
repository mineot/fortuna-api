import type { ButtonProps, ButtonVariant } from './button.types';

function Button(props: ButtonProps) {
  const classes = ['d-flex', 'align-items-center', 'gap-2', 'btn', 'btn-sm', `btn-${props.variant ?? 'primary'}`].join(
    ' ',
  );

  return (
    <button type={props.type ?? 'button'} className={classes} onClick={props.onClick} disabled={props.disabled}>
      {props.icon && <i className={`bi bi-${props.icon}`}></i>}
      {props.label && <span>{props.label}</span>}
    </button>
  );
}

export { Button, type ButtonVariant, type ButtonProps };
