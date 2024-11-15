import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from 'src/app/home/home-routing.module';
import { HomeComponent } from './home.component';
import { PredatorsComponent } from './predators/predators.component';
import { PredatorFormComponent } from './predators/predator-form/predator-form.component';
import { DynamicFieldsModule } from '../common/dynamic-fields/dynamic-fields.module';
import { TranslateModule } from '@ngx-translate/core';
import { GalleryModule } from 'ng-gallery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonCustomModule } from '../common/common-custom.module';
import { PredatorDetailsComponent } from './predators/predator-details/predator-details.component';
import { GoogleMapsModule } from '@angular/google-maps';

const routes = [
  {
    path: 'predators',
    component: PredatorsComponent,
  },
  {
    path: 'predator-details/:id',
    component: PredatorDetailsComponent,
  },
  {
    path: 'photos',
    component: PhotosComponent,
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    PhotosComponent,
    PredatorsComponent,
    PredatorFormComponent,
    PredatorDetailsComponent,
  ],
  imports: [
    CommonModule,
    GalleryModule,
    FormsModule,
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DynamicFieldsModule,
    TranslateModule,
    CommonCustomModule,
    GoogleMapsModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class HomeModule {}
