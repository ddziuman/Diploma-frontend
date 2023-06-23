import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { SchoolRegisterComponent } from './school-register/school-register.component';
import { SchoolAuthorizeComponent } from './school-authorize/school-authorize.component';
import { SharedModule } from './shared/shared.module';
import { YjsEditorComponent } from './shared/components/yjs-editor/yjs-editor.component';
import { HttpService } from './shared/services/http.service';
import { AuthGuard } from './shared/guards/auth-guard.guard';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { UserService } from './shared/entity-services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    SchoolRegisterComponent,
    SchoolAuthorizeComponent,
    YjsEditorComponent,
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
  ],
  providers: [HttpService, UserService, AuthGuard],
  bootstrap: [AppComponent],
  exports: [YjsEditorComponent],
})
export class AppModule {
  constructor(private readonly UserService: UserService) {}
}
