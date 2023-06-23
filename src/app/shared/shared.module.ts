import { NgModule } from '@angular/core';
import { SchoolAccountService } from './entity-services/school-account.service';
import { VoiceChatComponent } from './components/voice-chat/voice-chat.component';
import { SocketIoModule } from 'ngx-socket-io';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TestComponent } from './components/test/test.component';
import { ValidatorComponent } from './components/validator/validator.component';
import { ReplacePipe } from './pipes/replace.pipe';
import {
  NgxSpinnerModule,
  NgxSpinnerService,
  NgxSpinnerComponent,
} from 'ngx-spinner';
import { RegistryInteractorService } from '../school-register/registry-interactor.service';
import { DefaultErrorPopupComponent } from './popups/default-error.popup/default-error.popup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

const MAT_MODULES = [
  MatSlideToggleModule,
  MatTabsModule,
  MatIconModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatSelectModule,
  MatTableModule,
];
@NgModule({
  declarations: [
    VoiceChatComponent,
    TestComponent,
    ValidatorComponent,
    ReplacePipe,
    DefaultErrorPopupComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    SocketIoModule.forRoot({
      url: 'ws://localhost:3004',
    }),
    ...MAT_MODULES,
  ],
  providers: [
    SchoolAccountService,
    RegistryInteractorService,
    NgxSpinnerService,
  ],
  exports: [
    VoiceChatComponent,
    ValidatorComponent,
    NgxSpinnerComponent,
    ...MAT_MODULES,
  ],
})
export class SharedModule {
  constructor(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon(
      'avatar-placeholder',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../assets/avatar-placeholder.svg'
      )
    );
  }
}
