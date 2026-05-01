import type { ButtonProps } from './button.types';

export function Button(props: ButtonProps) {
  return (
    <button className="app-button" onClick={props.onClick}>
      {props.icon && <i className={props.icon}></i>}
      <span>{props.label}</span>
    </button>
  );
}
