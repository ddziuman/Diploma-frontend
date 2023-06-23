import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/entity-services/user.service';
import { Role } from 'src/app/shared/enums/role.enum';
import { createUniqueEmailValidator } from 'src/app/shared/validators/unique-user-email.validator';
import { userPasswordRepeatedValidator } from 'src/app/shared/validators/user-password-repeated.validator';

export class TeacherModel extends FormGroup {
  constructor(private readonly userService: UserService) {
    super(
      {
        role: new FormControl(Role.Teacher),
        email: new FormControl(
          'soluyansasha@gmail.com',
          [Validators.required, Validators.email],
          [createUniqueEmailValidator(userService)]
        ),
        password: new FormControl('456jkL8910@', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/),
        ]),
        passwordRepeat: new FormControl('456jkL8910@', [Validators.required]),
        firstName: new FormControl('Олександр', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[а-щА-ЩЬьЮюЯяІіЇїЄєҐґ])[а-щА-ЩЬьЮюЯяІіЇїЄєҐґ'-`’]*$/
          ),
        ]),
        fatherName: new FormControl('Анатолійович', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[а-щА-ЩЬьЮюЯяІіЇїЄєҐґ])[а-щА-ЩЬьЮюЯяІіЇїЄєҐґ'-`’]*$/
          ),
        ]),
        lastName: new FormControl('Солуян', [
          Validators.required,
          Validators.pattern(
            /^(?=.*[а-щА-ЩЬьЮюЯяІіЇїЄєҐґ])[а-щА-ЩЬьЮюЯяІіЇїЄєҐґ'-`’]*$/
          ),
        ]),
        phoneNumber: new FormControl('0987151307', [
          Validators.pattern(/^(?:\+\d{1,})?\d{1,}$/),
          Validators.required,
        ]),
        subjects: new FormControl([1, 2], [Validators.required]),
      },
      { validators: [userPasswordRepeatedValidator] }
    );
  }

  get email() {
    return this.get('email') as FormControl;
  }

  get password() {
    return this.get('password') as FormControl;
  }

  get passwordRepeat() {
    return this.get('passwordRepeat') as FormControl;
  }

  get firstName() {
    return this.get('firstName') as FormControl;
  }

  get fatherName() {
    return this.get('fatherName') as FormControl;
  }

  get phoneNumber() {
    return this.get('phoneNumber') as FormControl;
  }

  get lastName() {
    return this.get('lastName') as FormControl;
  }

  get subjects() {
    return this.get('subjects') as FormControl;
  }
}
