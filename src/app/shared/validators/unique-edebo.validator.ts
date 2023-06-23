import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SchoolAccountService } from '../entity-services/school-account.service';

export function createUniqueEdeboValidator(
  schoolAccountService: SchoolAccountService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors> => {
    return timer(500).pipe(
      switchMap(() =>
        schoolAccountService.ifSchoolWithEdeboExists(control.value)
      ),
      map(({ exist }) => {
        return exist ? { edeboAlreadyExists: true } : null;
      })
    );
  };
}
