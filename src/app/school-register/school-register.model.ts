import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from '../shared/enums/role.enum';
import { createUniqueEmailValidator } from '../shared/validators/unique-user-email.validator';
import { UserService } from '../shared/entity-services/user.service';
import { userPasswordRepeatedValidator } from '../shared/validators/user-password-repeated.validator';
import { createUniqueEdeboValidator } from '../shared/validators/unique-edebo.validator';
import { SchoolAccountService } from '../shared/entity-services/school-account.service';

export class SchoolRegisterModel extends FormGroup {
  constructor(
    private readonly userService: UserService,
    private readonly schoolAccountService: SchoolAccountService
  ) {
    super({
      organizer: new FormGroup(
        {
          role: new FormControl(Role.Organizer),
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
          ]),
        },
        { validators: [userPasswordRepeatedValidator] }
      ),
      school: new FormGroup({
        edebo: new FormControl(
          142331,
          [Validators.required],
          [createUniqueEdeboValidator(schoolAccountService)]
        ),
        fullName: new FormControl('', [Validators.required]),
        shortName: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        ownership: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        schoolPhoneNumber: new FormControl('', [Validators.required]),
        director: new FormControl('', [Validators.required]),
        koatuuName: new FormControl('', [Validators.required]),
        workStatus: new FormControl(false),
      }),
    });
  }

  get organizerGroup() {
    return this.get('organizer');
  }

  get schoolGroup() {
    return this.get('school');
  }

  get edebo() {
    return this.schoolGroup.get('edebo') as FormControl;
  }

  get email() {
    return this.organizerGroup.get('email') as FormControl;
  }

  get password() {
    return this.organizerGroup.get('password') as FormControl;
  }

  get passwordRepeat() {
    return this.organizerGroup.get('passwordRepeat') as FormControl;
  }

  get firstName() {
    return this.organizerGroup.get('firstName') as FormControl;
  }

  get fatherName() {
    return this.organizerGroup.get('fatherName') as FormControl;
  }

  get phoneNumber() {
    return this.organizerGroup.get('phoneNumber') as FormControl;
  }

  get lastName() {
    return this.organizerGroup.get('lastName') as FormControl;
  }

  get fullName() {
    return this.schoolGroup.get('fullName') as FormControl;
  }

  get shortName() {
    return this.schoolGroup.get('shortName') as FormControl;
  }
  get type() {
    return this.schoolGroup.get('type') as FormControl;
  }
  get ownership() {
    return this.schoolGroup.get('ownership') as FormControl;
  }
  get address() {
    return this.schoolGroup.get('address') as FormControl;
  }
  get schoolPhoneNumber() {
    return this.schoolGroup.get('schoolPhoneNumber') as FormControl;
  }
  get director() {
    return this.schoolGroup.get('director') as FormControl;
  }
  get workStatus() {
    return this.schoolGroup.get('workStatus') as FormControl;
  }
  get koatuuName() {
    return this.schoolGroup.get('koatuuName') as FormControl;
  }
}
