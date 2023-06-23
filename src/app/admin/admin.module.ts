import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ClassService } from '../shared/entity-services/class.service';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ClassesComponent } from './components/classes/classes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '../shared/interceptors/global-http.interceptor';
import { TeachersComponent } from './components/teachers/teachers.component';
import { CreateTeacherComponent } from './components/create-teacher/create-teacher.component';
import { TeachersService } from '../shared/entity-services/teachers.service';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleService } from '../shared/entity-services/schedule.service';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ClassesComponent,
    TeachersComponent,
    CreateTeacherComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    ClassService,
    NgxSpinnerService,
    TeachersService,
    ScheduleService,
  ],
})
export class AdminModule {}
