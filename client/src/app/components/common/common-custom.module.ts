import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderComponent } from './loader/loader.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GalleryComponent } from './gallery/gallery.component';
import { TranslateModule } from '@ngx-translate/core';
import { GalleryModule } from 'ng-gallery';
import { MapComponent } from './map/map.component';
import { QuestionAlertComponent } from './question-alert/question-alert.component';
import { NoDataComponent } from './no-data/no-data.component';

@NgModule({
  declarations: [
    LoaderComponent,
    GalleryComponent,
    MapComponent,
    QuestionAlertComponent,
    NoDataComponent,
  ],
  imports: [CommonModule, IonicModule, TranslateModule, GalleryModule],
  providers: [],
  bootstrap: [],
  exports: [
    LoaderComponent,
    GalleryComponent,
    MapComponent,
    QuestionAlertComponent,
    NoDataComponent,
  ],
})
export class CommonCustomModule {}
