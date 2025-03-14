import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppIonSelectComponent } from './app-ion-select/app-ion-select.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AppIonInputComponent } from './app-ion-input/app-ion-input.component';
import { AppIonTextareaComponent } from './app-ion-textarea/app-ion-textarea.component';
import { AppIonDatetimeButtonComponent } from './app-ion-datetime-button/app-ion-datetime-button.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppIonSelectComponent,
    AppIonInputComponent,
    AppIonTextareaComponent,
    AppIonDatetimeButtonComponent
  ],
  imports: [CommonModule, IonicModule, TranslateModule, FormsModule],
  providers: [],
  bootstrap: [],
  exports: [
    AppIonSelectComponent,
    AppIonInputComponent,
    AppIonTextareaComponent,
    AppIonDatetimeButtonComponent
  ],
})
export class DynamicFieldsModule {}
