import type { ChangeEvent } from 'react';
import type { InputProps, InputValue } from './_input.types';

function toInputString(value: InputValue | undefined): string {
  if (value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function Input(props: InputProps) {
  const messageClass = props.messageType === 'warning' ? 'text-warning' : 'text-danger';
  const inputValue = props.parseFrom ? props.parseFrom(props.value ?? '') : toInputString(props.value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!props.onChange) return;

    if (!props.parseTo) {
      props.onChange(event);
      return;
    }

    const parsedValue = props.parseTo(event.target.value);
    const nextStringValue = props.parseFrom ? props.parseFrom(parsedValue) : toInputString(parsedValue);

    event.target.value = nextStringValue;
    event.currentTarget.value = nextStringValue;
    props.onChange(event);
  };

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
        value={inputValue}
        placeholder={props.placehoder}
        onChange={handleChange}
        required={props.required}
      />
      {props.message && <div className={`form-text ${messageClass}`}>{props.message}</div>}
    </div>
  );
}

export { Input, type InputProps, type InputValue };
