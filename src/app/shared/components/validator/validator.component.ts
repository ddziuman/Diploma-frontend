import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationMessages } from '../../utils/validator-messages';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss'],
})
export class ValidatorComponent {
  @Input() control: FormControl;

  validationMessages = ValidationMessages;
}
