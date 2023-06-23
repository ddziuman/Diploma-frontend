import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './dashboard/dashboard.component';
import { ClassesComponent } from './components/classes/classes.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { CreateTeacherComponent } from './components/create-teacher/create-teacher.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/classes',
  },
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'classes',
        component: ClassesComponent,
      },
      {
        path: 'teachers',
        children: [
          {
            path: '',
            component: TeachersComponent,
          },
          {
            path: 'create',
            component: CreateTeacherComponent,
          },
        ],
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
