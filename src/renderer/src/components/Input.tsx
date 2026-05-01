import type { InputProps } from './input.types';

export function Input(props: InputProps) {
  const stateClass = props.error ? 'err' : props.warning ? 'warn' : '';
  const requiredClass = props.required ? 'req' : '';
  const className = ['app-input', stateClass, requiredClass].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type="text"
        value={props.value ?? ''}
        onChange={(event) => props.onChange?.(event.target.value)}
        aria-invalid={props.error || undefined}
      />
      <div className="message">{props.message}</div>
    </div>
  );
}

// How use:
{
  /* <Input
  id="name"
  label="Nome"
  value={value}
  onChange={setValue}
  error={hasError}
  message={hasError ? 'Mínimo 3 caracteres' : ''}
/> */
}
