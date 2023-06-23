import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { UserService } from '../entity-services/user.service';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export function createUniqueEmailValidator(
  userService: UserService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors> => {
    return timer(500).pipe(
      switchMap(() => userService.isUserExist(control.value)),
      map(({ exist }) => (exist ? { nonUniqueUserEmail: true } : null))
    );
  };
}
