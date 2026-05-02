import { useInput } from './_input.hooks';
import type { InputProps, InputValue } from './_input.types';

function Input(props: InputProps) {
  const { required, inputValue, validationMessage, handleChange } = useInput(props);

  return (
    <div className="d-flex flex-column gap-0 justify-content-center">
      <label htmlFor={props.id} className="form-label m-0 d-flex gap-1 align-items-center">
        {props.label}
        {required && <span className="text-danger">&#8226;</span>}
      </label>
      <input
        id={props.id}
        type={props.type ?? 'text'}
        className="form-control form-control-sm"
        value={inputValue}
        placeholder={props.placehoder}
        onChange={handleChange}
        required={required}
      />
      {validationMessage && <div className="form-text text-danger">{validationMessage}</div>}
    </div>
  );
}

export { Input, type InputProps, type InputValue };
