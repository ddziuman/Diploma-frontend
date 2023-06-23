import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../shared/entity-services/user.service';
import {} from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { Role } from '../shared/enums/role.enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-school-authorize',
  templateUrl: './school-authorize.component.html',
  styleUrls: ['./school-authorize.component.scss'],
})
export class SchoolAuthorizeComponent {
  loginForm: FormGroup;
  authorized: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authorized = false;
    this.loginForm = this.fb.group({
      email: [
        'soluyansasha1@gmail.com',
        [Validators.required, Validators.email],
      ],
      password: ['456jkL8910@', [Validators.required]],
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAsTouched();
      return;
    }
    this.spinner.show();
    this.userService
      .login(this.loginForm.value)
      .pipe(
        tap(() => {
          this.spinner.hide();
        }),
        switchMap(() => this.userService.user$),
        tap((user) => this.onLoggedIn(user.role))
      )
      .subscribe();
  }

  onLoggedIn(role: Role) {
    switch (role) {
      case Role.Organizer:
        this.router.navigate(['../admin-dashboard', 'classes'], {
          relativeTo: this.route,
        });
        break;

      case Role.Teacher:
        break;
      case Role.Pupil:
        break;
    }
  }
}
