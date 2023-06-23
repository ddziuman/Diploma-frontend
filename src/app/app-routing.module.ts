import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolAuthorizeComponent } from './school-authorize/school-authorize.component';
import { SchoolRegisterComponent } from './school-register/school-register.component';
import { AuthGuard } from './shared/guards/auth-guard.guard';
import { YjsEditorComponent } from './shared/components/yjs-editor/yjs-editor.component';
import { VoiceChatComponent } from './shared/components/voice-chat/voice-chat.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  { path: 'notebookPage/:notebookPage', component: YjsEditorComponent },
  { path: 'voice-chat', component: VoiceChatComponent },
  { path: 'register', component: SchoolRegisterComponent },
  { path: 'login', component: SchoolAuthorizeComponent },
  {
    path: 'admin-dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../app/admin/admin.module').then((m) => m.AdminModule),
    data: { roles: [0] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
