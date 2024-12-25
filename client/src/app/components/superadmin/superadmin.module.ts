import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AllAdminsComponent } from './all-admins/all-admins.component';

import { CommonModule } from '@angular/common';
import { SuperadminComponent } from './superadmin.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicModule } from '../common/dynamic-component/dynamic.module';
import { AllActivitiesComponent } from './all-activities/all-activities.component';
import { AllPredatorsComponent } from './all-predators/all-predators.component';
import { AllTerritoriesComponent } from './all-territories/all-territories.component';
import { AllTypeOfWatersComponent } from './all-type-of-waters/all-type-of-waters.component';

const routes = [
  {
    path: 'all-admins',
    component: AllAdminsComponent,
  },
  {
    path: 'all-activities',
    component: AllActivitiesComponent,
  },
  {
    path: 'all-predators',
    component: AllPredatorsComponent,
  },
  {
    path: 'all-territories',
    component: AllTerritoriesComponent,
  },
  {
    path: 'all-type-of-waters',
    component: AllTypeOfWatersComponent,
  },
];

@NgModule({
  declarations: [
    SuperadminComponent,
    AllAdminsComponent,
    AllActivitiesComponent,
    AllPredatorsComponent,
    AllTerritoriesComponent,
    AllTypeOfWatersComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DynamicModule,
    RouterModule.forChild(routes),
    IonicModule,
    TranslateModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class SuperadminModule {}
