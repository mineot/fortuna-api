import type { InputProps } from './_input.types';

export function Input(props: InputProps) {
  const messageClass = props.messageType === 'warning' ? 'text-warning' : 'text-danger';

  return (
    <div className="d-flex flex-column gap-0 justify-content-center">
      <label htmlFor={props.id} className="form-label m-0 d-flex gap-1 align-items-center">
        {props.label}
        {props.required && <span className="text-danger">&#8226;</span>}
      </label>
      <input
        id={props.id}
        type={props.type ?? 'text'}
        className="form-control form-control-sm"
        defaultValue={props.value}
        placeholder={props.placehoder}
        onChange={props.onChange}
        required={props.required}
      />
      {props.message && <div className={`form-text ${messageClass}`}>{props.message}</div>}
    </div>
  );
}
