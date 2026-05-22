import { ValidatorFn } from '@angular/forms';

export const validationHelpers = {
  withMessage(validator: ValidatorFn, errorKey: string, getMessage: () => string): ValidatorFn {
    return (control) => {
      const result = validator(control);
      if (!result || !(errorKey in result)) {
        return null;
      }

      const errorValue = result[errorKey];
      const normalizedErrorValue =
        errorValue && typeof errorValue === 'object' ? errorValue : {};

      return {
        [errorKey]: {
          ...normalizedErrorValue,
          message: getMessage(),
        },
      };
    };
  },
};
