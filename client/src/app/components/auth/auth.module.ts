import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInFormComponent } from './login/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from './login/sign-up-form/sign-up-form.component';
import { IonicModule } from '@ionic/angular';
import { CommonCustomModule } from '../common/common-custom.module';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, SignInFormComponent, SignUpFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    IonicModule,
    CommonCustomModule,
    TranslateModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class AuthModule {}
