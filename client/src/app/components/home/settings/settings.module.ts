import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { DynamicModule } from '../../common/dynamic-component/dynamic.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { IonicModule, IonInput } from '@ionic/angular';
import { DynamicFieldsModule } from '../../common/dynamic-component/dynamic-fields/dynamic-fields.module';

const routes = [
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
];

@NgModule({
  declarations: [ProfileComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DynamicModule,
    TranslateModule,
    IonicModule,
    DynamicFieldsModule
  ],
  providers: [],
  exports: [RouterModule],
})
export class SettingsModule {}
