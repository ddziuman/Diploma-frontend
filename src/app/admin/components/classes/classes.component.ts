import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  ClassDto,
  ClassService,
} from 'src/app/shared/entity-services/class.service';
import { Observable, EMPTY } from 'rxjs';
import { tap, switchMap, delay } from 'rxjs/operators';
import { ClassesModel } from './ClassesModel';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DefaultErrorPopupComponent } from 'src/app/shared/popups/default-error.popup/default-error.popup.component';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesComponent implements OnInit {
  classModel = new ClassesModel();
  classes$: Observable<ClassDto>;
  possibleClasses = [5, 6, 7, 8, 9, 10, 11];

  classDefined: boolean;

  constructor(
    private readonly classService: ClassService,
    private readonly spinner: NgxSpinnerService,
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.subsribeOnClassDefined();
  }

  addClass(index: number) {
    let formArray = this.classModel.controls[index] as FormArray;
    if (!formArray) {
      formArray = new FormArray([]);
      this.classModel.addControl(index.toString(), formArray);
    }
    formArray.push(
      new FormGroup({
        name: new FormControl('new name', [Validators.required]),
        sequence: new FormControl(
          formArray.controls[formArray.length - 1]?.value.sequence + 1 || 1,
          [Validators.required]
        ),
      })
    );
  }
  removeClass(formArrayIndex: number, formGroupIndex: number) {
    let formArray = this.classModel.controls[formArrayIndex] as FormArray;

    formArray.removeAt(formGroupIndex);
  }

  preselectClasses(items: ClassDto) {
    this.possibleClasses.forEach((index) => {
      let formArray = this.classModel.controls[index] as FormArray;
      formArray.clear();
      items[index].forEach((item) => {
        formArray.push(
          new FormGroup({
            name: new FormControl(item.name),
            sequence: new FormControl(item.sequence),
          })
        );
      });
    });
  }

  subsribeOnClassDefined() {
    this.classes$ = this.classService.ifClassDefined().pipe(
      switchMap((defined) => {
        this.classDefined = defined.isDefined;
        if (this.classDefined) {
          this.spinner.show();
          return this.classService.getClasses().pipe(
            tap((items) => {
              this.preselectClasses(items);
              this.spinner.hide();
            })
          );
        }
        this.dialog.open(DefaultErrorPopupComponent, {
          width: '500px',
          height: '280px',
          data: {
            label: 'Класи не визначені',
            description:
              'Будь-ласка налаштуйте конфігурацію класів перед тим як продовжити.',
          },
        });
        return EMPTY;
      })
    );
  }

  saveClasses() {
    this.spinner.show();
    this.classService.saveClasses(this.classModel.value).subscribe(() => {
      this.classDefined = true;
      this.cdr.detectChanges();
      this.spinner.hide();
    });
  }
}
