import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export class ClassesModel extends FormGroup {
  constructor() {
    super({
      5: new FormArray([
        new FormGroup({
          name: new FormControl('5-A Class', [Validators.required]),
          sequence: new FormControl(1, [Validators.required]),
        }),
      ]),
      6: new FormArray([
        new FormGroup({
          name: new FormControl('6-A Class', [Validators.required]),
          sequence: new FormControl(1, [Validators.required]),
        }),
      ]),
      7: new FormArray([
        new FormGroup({
          name: new FormControl('7-A Class', [Validators.required]),
          sequence: new FormControl(1, [Validators.required]),
        }),
      ]),
      8: new FormArray([
        new FormGroup({
          name: new FormControl('8-A Class', [Validators.required]),
          sequence: new FormControl(1, [Validators.required]),
        }),
      ]),
      9: new FormArray([
        new FormGroup({
          name: new FormControl('9-A Class', [Validators.required]),
          sequence: new FormControl(1, [Validators.required]),
        }),
      ]),
      10: new FormArray([
        new FormGroup({
          name: new FormControl('10-A Class', [Validators.required]),
          sequence: new FormControl(1, [Validators.required]),
        }),
      ]),
      11: new FormArray([
        new FormGroup({
          name: new FormControl('11-A Class', [Validators.required]),
          sequence: new FormControl(1, [Validators.required]),
        }),
      ]),
    });
  }
}
