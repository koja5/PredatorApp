import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderComponent } from './loader/loader.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GalleryComponent } from './gallery/gallery.component';
import { TranslateModule } from '@ngx-translate/core';
import { GalleryModule } from 'ng-gallery';

@NgModule({
  declarations: [LoaderComponent, GalleryComponent],
  imports: [CommonModule, IonicModule, TranslateModule, GalleryModule],
  providers: [],
  bootstrap: [],
  exports: [LoaderComponent, GalleryComponent],
})
export class CommonCustomModule {}
