import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ScheduleDto,
  WeekDays,
} from 'src/app/shared/entity-services/schedule.service';

export class ScheduleModel extends FormGroup {
  constructor(data: ScheduleDto) {
    let formGroupConfig = {};
    for (let weekDay in WeekDays) {
      let formArr = new FormArray([]);
      for (let i = 0; i < data[WeekDays[weekDay]].length; i++) {
        formArr.push(
          new FormGroup({
            slot: new FormControl({ disabled: true, value: i + 1 }, [
              Validators.required,
            ]),
            subjectId: new FormControl(data[WeekDays[weekDay]][i].subjectId, [
              Validators.required,
            ]),
            teacherId: new FormControl(data[WeekDays[weekDay]][i].teacherId, [
              Validators.required,
            ]),
            description: new FormControl(
              data[WeekDays[weekDay]][i].description,
              [Validators.required]
            ),
          })
        );
      }
      formGroupConfig[WeekDays[weekDay]] = formArr;
    }
    super(formGroupConfig);
  }

  addSlot(weekDay: string) {
    let formArr = this.controls[weekDay] as FormArray;

    formArr.push(
      new FormGroup({
        slot: new FormControl({ disabled: true, value: formArr.length + 1 }, [
          Validators.required,
        ]),
        subjectId: new FormControl(null, [Validators.required]),
        teacherId: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
      })
    );
  }

  deleteSlot(weekDay: string, index: number) {
    let formArr = this.controls[weekDay] as FormArray;
    formArr.removeAt(index);
    for (let i = index; i < formArr.controls.length; i++) {
      let slotControl = (formArr.at(i) as FormGroup).controls['slot'];
      slotControl.setValue(slotControl.value - 1);
    }
  }
}
