import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-default-error.popup',
  templateUrl: './default-error.popup.component.html',
  styleUrls: ['./default-error.popup.component.scss'],
})
export class DefaultErrorPopupComponent {
  label: string;
  description: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.label = data.label;
    this.description = data.description;
  }
}
