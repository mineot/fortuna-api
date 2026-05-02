import { type ChangeEvent } from 'react';
import { type FormProps } from './_form.types';
import { Input, type Validation } from '@widgets';
import { useForm } from './_form.hook';

export function Form(props: FormProps) {
  const { onFormSubmit, onFormClean, controls, formData, getValidations, onChange } = useForm(props);

  return (
    <form className="d-flex flex-column gap-2" onSubmit={onFormSubmit} onReset={onFormClean}>
      {controls.map((control) => {
        const controlValue = formData[control.id] ?? control.value;
        const validations: Validation[] = getValidations(control.id, control.validations);

        return (
          <Input
            key={control.id}
            id={control.id}
            label={control.label}
            validations={validations}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event, control)}
            {...(controlValue !== undefined ? { value: controlValue } : {})}
            {...(control.type !== undefined ? { type: control.type } : {})}
            {...(control.placehoder !== undefined ? { placehoder: control.placehoder } : {})}
            {...(control.parseFrom !== undefined ? { parseFrom: control.parseFrom } : {})}
          />
        );
      })}
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-sm btn-primary">
          Submit
        </button>
        <button type="reset" className="btn btn-sm btn-outline-warning">
          Clean
        </button>
        {props.onCancel && (
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={props.onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
