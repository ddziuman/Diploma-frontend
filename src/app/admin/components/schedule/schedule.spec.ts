import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleComponent } from './schedule.component';
import { ScheduleService } from 'src/app/shared/entity-services/schedule.service';
import { ClassService } from 'src/app/shared/entity-services/class.service';
import { TeachersService } from 'src/app/shared/entity-services/teachers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      providers: [
        ScheduleService,
        ClassService,
        TeachersService,
        NgxSpinnerService,
        HttpHandler,
        HttpClient,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
