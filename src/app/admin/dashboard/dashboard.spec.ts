import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/entity-services/user.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminModule } from '../admin.module';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        UserService,
        HttpClient,
        HttpHandler,
      ],
      imports: [SharedModule, BrowserAnimationsModule, AdminModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
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
