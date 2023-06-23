import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { ClassService } from 'src/app/shared/entity-services/class.service';
import {
  ScheduleDto,
  ScheduleService,
  WeekDays,
} from 'src/app/shared/entity-services/schedule.service';
import { ScheduleModel } from './schedule-model';
import {
  Subject,
  Teacher,
  TeachersService,
} from 'src/app/shared/entity-services/teachers.service';
import { PaginatedItems } from '../teachers/teachers.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  classes$: Observable<
    { grade: number; sequence: number; name: string; id: number }[]
  >;
  subjects$: Observable<Subject[]>;
  weekDays = Object.values(WeekDays);

  classId = new FormControl();

  teachersOptionsArr$: [
    Observable<Teacher[]>[],
    Observable<Teacher[]>[],
    Observable<Teacher[]>[],
    Observable<Teacher[]>[],
    Observable<Teacher[]>[]
  ];

  scheduleModel: ScheduleModel;
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly classService: ClassService,
    private readonly teacherService: TeachersService,
    private readonly spinnerService: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.setClassesObs();
    this.setSubjects();
    this.subscribeOnclassChange();
  }

  selectionChange(weekDayIndex: number, slotIndex: number) {
    this.teachersOptionsArr$[weekDayIndex][slotIndex] = this.teacherService
      .getTeachersFromSchool(
        0,
        20,
        [
          (
            (
              this.scheduleModel.controls[
                this.weekDays[weekDayIndex]
              ] as FormArray
            ).controls[slotIndex] as FormGroup
          ).controls['subjectId'].value,
        ],
        this.weekDays[weekDayIndex],
        (
          (
            this.scheduleModel.controls[
              this.weekDays[weekDayIndex]
            ] as FormArray
          ).controls[slotIndex] as FormGroup
        ).controls['slot'].value
      )
      .pipe(map((result: PaginatedItems<Teacher>) => result.items));
  }

  saveSchedule() {
    if (!(this.classId.valid && this.scheduleModel.valid)) {
      this.classId.markAllAsTouched();
      this.scheduleModel.markAllAsTouched();
      return;
    }
    this.spinnerService.show();

    this.scheduleService
      .saveSchedule({
        classId: this.classId.value,
        schedule: this.scheduleModel.getRawValue(),
      })
      .pipe(
        tap(() => {
          this.spinnerService.hide();
        })
      )
      .subscribe();
  }

  subscribeOnclassChange() {
    this.classId.valueChanges
      .pipe(
        tap(() => {
          this.spinnerService.show();
        }),
        switchMap((classId) => {
          return this.scheduleService.getScheduleByClass(classId);
        }),
        tap((data) => {
          this.spinnerService.hide();
          this.scheduleModel = new ScheduleModel(data);

          this.setTeachersOptionsArr(data);
        })
      )
      .subscribe();
  }

  addSlot(index: number) {
    this.scheduleModel.addSlot(this.weekDays[index]);
  }

  deleteSlot(weekIndex: number, slotIndex: number) {
    this.scheduleModel.deleteSlot(this.weekDays[weekIndex], slotIndex);
    this.teachersOptionsArr$[weekIndex].splice(slotIndex, 1);
  }

  private setClassesObs() {
    this.classes$ = this.classService.getClasses().pipe(
      map((classes) => {
        let result: {
          grade: number;
          sequence: number;
          name: string;
          id: number;
        }[] = [];
        for (let property in classes) {
          classes[property].forEach((class_) => {
            result.push({
              grade: parseInt(property),
              ...class_,
            });
          });
        }
        return result;
      })
    );
  }

  private setSubjects() {
    this.subjects$ = this.teacherService.getSubjects().pipe(shareReplay());
  }

  private setTeachersOptionsArr(data: ScheduleDto) {
    this.teachersOptionsArr$ = [[], [], [], [], []];
    for (let weekIndex = 0; weekIndex < this.weekDays.length; weekIndex++) {
      for (let i = 0; i < data[this.weekDays[weekIndex]].length; i++) {
        this.teachersOptionsArr$[weekIndex].push(
          this.teacherService
            .getTeachersFromSchool(
              0,
              20,
              [
                (
                  (
                    this.scheduleModel.controls[
                      this.weekDays[weekIndex]
                    ] as FormArray
                  ).controls[i] as FormGroup
                ).controls['subjectId'].value,
              ],
              this.weekDays[weekIndex],
              (
                (
                  this.scheduleModel.controls[
                    this.weekDays[weekIndex]
                  ] as FormArray
                ).controls[i] as FormGroup
              ).controls['slot'].value,
              (
                (
                  this.scheduleModel.controls[
                    this.weekDays[weekIndex]
                  ] as FormArray
                ).controls[i] as FormGroup
              ).controls['teacherId'].value
            )
            .pipe(map((result: PaginatedItems<Teacher>) => result.items))
        );
      }
    }
  }
}
