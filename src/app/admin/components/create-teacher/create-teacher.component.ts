import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/entity-services/user.service';
import { TeacherModel } from './teacher-model';
import {
  Subject,
  TeachersService,
} from 'src/app/shared/entity-services/teachers.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss'],
})
export class CreateTeacherComponent implements OnInit {
  teacherModel = new TeacherModel(this.userService);
  subjects$: Observable<Subject[]>;

  constructor(
    private readonly userService: UserService,
    private readonly teacherService: TeachersService,
    private readonly spinnerService: NgxSpinnerService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subjects$ = this.teacherService.getSubjects();
  }

  saveTeacher() {
    if (!this.teacherModel.valid) {
      this.teacherModel.markAllAsTouched();
      return;
    }
    this.spinnerService.show();
    this.teacherService
      .createTeacher(this.teacherModel.value)
      .pipe(
        tap(() => {
          this.spinnerService.hide();
          this.router.navigate(['../'], { relativeTo: this.route });
        })
      )
      .subscribe();
  }
}
