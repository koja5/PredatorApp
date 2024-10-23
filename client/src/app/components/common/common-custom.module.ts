import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderComponent } from './loader/loader.component';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule],
  providers: [],
  bootstrap: [],
  exports: [LoaderComponent],
})
export class CommonCustomModule {}
