import { type FormProps } from './_form.types';
import { Input } from '@widgets';

export function Form(props: FormProps) {
  const controls = props.controls ?? [];
  const data = props.data ?? {};

  return (
    <form className="d-flex flex-column gap-2" onSubmit={props.onSubmit} onReset={props.onClean}>
      {controls.map((control) => {
        const controlValue = data[control.id] ?? control.value;

        return (
          <Input
            key={control.id}
            id={control.id}
            label={control.label}
            {...(controlValue !== undefined ? { value: controlValue } : {})}
            {...(control.type !== undefined ? { type: control.type } : {})}
            {...(control.placehoder !== undefined ? { placehoder: control.placehoder } : {})}
            {...(control.onChange !== undefined ? { onChange: control.onChange } : {})}
            {...(control.parseFrom !== undefined ? { parseFrom: control.parseFrom } : {})}
            {...(control.parseTo !== undefined ? { parseTo: control.parseTo } : {})}
            {...(control.validations !== undefined ? { validations: control.validations } : {})}
          />
        );
      })}
      {(props.enableClean || props.enableCancel || props.onSubmit) && (
        <div className="d-flex gap-2 justify-content-end mt-2">
          {props.enableCancel && (
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={props.onCancel}>
              Cancel
            </button>
          )}
          {props.enableClean && (
            <button type="reset" className="btn btn-sm btn-outline-warning">
              Clean
            </button>
          )}
          {props.onSubmit && (
            <button type="submit" className="btn btn-sm btn-primary">
              Submit
            </button>
          )}
        </div>
      )}
    </form>
  );
}
