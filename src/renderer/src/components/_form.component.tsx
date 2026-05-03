import { type ChangeEvent } from 'react';
import { type FormProps } from './_form.types';
import { Button, Input, type Validation } from '@widgets';
import { useForm } from './_form.hook';
import { useTranslation } from 'react-i18next';

export function Form(props: FormProps) {
  const { t } = useTranslation();
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
        <Button type="submit" variant="primary" label={t('common.submit')} />
        <Button type="reset" variant="secondary" label={t('common.clean')} />
        {props.onCancel && <Button variant="secondary" label={t('common.cancel')} onClick={props.onCancel} />}
      </div>
    </form>
  );
}
