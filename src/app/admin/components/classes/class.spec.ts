import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassesComponent } from './classes.component';
import { ClassService } from 'src/app/shared/entity-services/class.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  MAT_DIALOG_SCROLL_STRATEGY,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminModule } from '../../admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ClassesComponent', () => {
  let component: ClassesComponent;
  let fixture: ComponentFixture<ClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClassesComponent],
      providers: [
        ClassService,
        NgxSpinnerService,
        NgxSpinnerService,
        MatDialog,
        ChangeDetectorRef,
        HttpClient,
        HttpHandler,
      ],
      imports: [AdminModule, SharedModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
