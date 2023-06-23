import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeachersComponent } from './teachers.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TeachersService } from 'src/app/shared/entity-services/teachers.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('TeachersComponent', () => {
  let component: TeachersComponent;
  let fixture: ComponentFixture<TeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachersComponent],
      providers: [
        Router,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        TeachersService,
        HttpClient,
        HttpHandler,
      ],
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
class MockActivatedRoute {
  // Implement the properties and methods used by your component
  // For example:
  queryParams = of({}); // Use 'of' from 'rxjs' to create an observable with empty data
  paramMap = of({}); // Use 'of' from 'rxjs' to create an observable with empty data
}
