import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const userPasswordRepeatedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const pass = control.get('password');
  const passRepeat = control.get('passwordRepeat');

  if (pass?.value !== passRepeat?.value) {
    passRepeat.setErrors({
      shouldBeEqual: {
        fieldToBeEqual: 'password',
      },
      ...passRepeat.errors,
    });
  } else {
    let errors = passRepeat.errors;
    if (errors && errors['shouldBeEqual']) {
      delete errors['shouldBeEqual'];
    }

    passRepeat.setErrors(errors);
  }

  return control.errors;
};
