import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EMPTY, of } from 'rxjs';
import { map, tap, delay, catchError, switchMap } from 'rxjs/operators';
import { RegistryInteractorService } from './registry-interactor.service';
import {
  SchoolAccount,
  SchoolAccountDto,
} from '../shared/interfaces/school-account.interface';

import { UserService } from '../shared/entity-services/user.service';
import { SchoolAccountService } from '../shared/entity-services/school-account.service';
import { RegistrySchool } from '../shared/interfaces/registry-school.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DefaultErrorPopupComponent } from '../shared/popups/default-error.popup/default-error.popup.component';
import { SchoolRegisterModel } from './school-register.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-school-register',
  templateUrl: './school-register.component.html',
  styleUrls: ['./school-register.component.scss'],
})
export class SchoolRegisterComponent {
  schoolForm: SchoolRegisterModel;

  search: {
    clicked: boolean;
    successful: boolean;
    displayMessage: string;
  };

  constructor(
    private fb: FormBuilder,
    private registryInteractorService: RegistryInteractorService,
    private userService: UserService,
    private spinnerService: NgxSpinnerService,
    private schoolAccountService: SchoolAccountService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.search = {
      clicked: false,
      successful: false,
      displayMessage: '',
    };

    this.schoolForm = new SchoolRegisterModel(
      userService,
      schoolAccountService
    );
  }

  onSubmit() {
    if (!this.schoolForm.valid) {
      this.schoolForm.markAllAsTouched();
      return;
    }
    const toSend = this.schoolForm.getRawValue() as SchoolAccountDto;
    this.spinnerService.show();
    this.userService
      .create(toSend)
      .pipe(
        delay(1000),
        tap(() => this.spinnerService.hide()),
        catchError((error) => {
          this.spinnerService.hide();
          return of(error);
        })
      )
      .subscribe(() => {
        this.router.navigate(['../login'], { relativeTo: this.route });
      });
  }

  onDefineSchool() {
    if (!this.schoolForm.edebo.valid || this.schoolForm.status === 'PENDING') {
      this.schoolForm.edebo.markAsTouched();
      return;
    }
    this.spinnerService.show();
    this.registryInteractorService
      .getRegistrySchoolByCode(this.schoolForm.edebo.value)
      .pipe(
        delay(1000),
        tap(() => this.spinnerService.hide()),
        catchError((err) => {
          this.spinnerService.hide();
          return this.dialog
            .open(DefaultErrorPopupComponent, {
              width: '500px',
              height: '280px',
              data: {
                label: 'Не знайдено навчальний заклад з таким ЄДБО',
                description:
                  'Код ЄДБО не є дійсним. Перевірте правильність та спробуйте ще раз',
              },
            })
            .afterClosed()
            .pipe(switchMap(() => of(null)));
        }),
        tap((result) => {
          if (result) {
            this.onDefineSuccess(result);
          } else {
            this.onDefineFailure();
          }
        })
      )
      .subscribe();
  }

  onDefineSuccess(data: RegistrySchool) {
    const schoolAccount =
      this.registryInteractorService.transformIntoSchoolAccount(data);
    this.updateSchoolAccountGroup(schoolAccount);
  }

  onDefineFailure() {
    this.schoolForm.schoolGroup.reset({
      edebo: this.schoolForm.edebo.value,
    });
  }

  updateSchoolAccountGroup(data: SchoolAccount) {
    this.schoolForm.fullName.setValue(data.fullName);
    this.schoolForm.shortName.setValue(data.shortName);
    this.schoolForm.type.setValue(data.type);
    this.schoolForm.ownership.setValue(data.ownership);
    this.schoolForm.address.setValue(data.address);
    this.schoolForm.schoolPhoneNumber.setValue(data.phoneNumber);
    this.schoolForm.director.setValue(data.director);
    this.schoolForm.koatuuName.setValue(data.koatuuName);
    this.schoolForm.workStatus.setValue(data.workStatus);
  }
}
