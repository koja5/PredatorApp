import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AllAdminsComponent } from './all-admins/all-admins.component';
import { DynamicGridModule } from '../common/dynamic-grid/dynamic-grid.module';
import { CommonModule } from '@angular/common';
import { SuperadminComponent } from './superadmin.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
    path: 'all-admins',
    component: AllAdminsComponent,
  },
];

@NgModule({
  declarations: [SuperadminComponent, AllAdminsComponent],
  imports: [
    CommonModule,
    FormsModule,
    DynamicGridModule,
    RouterModule.forChild(routes),
    IonicModule,
    TranslateModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class SuperadminModule {}
