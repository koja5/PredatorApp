import {
  CommonModule,
  NgOptimizedImage,
  provideImgixLoader,
} from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from 'src/app/home/home-routing.module';
import { HomeComponent } from './home.component';
import { PredatorsComponent } from './predators/predators.component';
import { PredatorEditComponent } from './predators/predator-edit/predator-edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { GalleryModule } from 'ng-gallery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonCustomModule } from '../common/common-custom.module';
import { PredatorDetailsComponent } from './predators/predator-details/predator-details.component';
import { PredatorProfileUserComponent } from './predators/predator-profile-user/predator-profile-user.component';
import { ToastrModule } from 'ngx-toastr';
import { DynamicFieldsModule } from '../common/dynamic-component/dynamic-fields/dynamic-fields.module';
import { LazyLoadImageDirective } from 'src/app/services/directives/lazy-load.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    path: 'predator-edit/:id',
    component: PredatorEditComponent,
  },
  {
    path: 'photos',
    component: PhotosComponent,
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    PhotosComponent,
    PredatorsComponent,
    PredatorEditComponent,
    PredatorDetailsComponent,
    PredatorProfileUserComponent,
    LazyLoadImageDirective,
  ],
  imports: [
    CommonModule,
    GalleryModule,
    FormsModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    CommonCustomModule,
    NgOptimizedImage,
    DynamicFieldsModule,
    ScrollingModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class HomeModule {}
