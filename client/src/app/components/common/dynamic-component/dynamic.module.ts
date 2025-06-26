import {
  DatePickerModule,
  DateTimePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import { ToastrComponent } from '../toastr/toastr.component';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { DynamicGridComponent } from './dynamic-grid/dynamic-grid.component';
import { CommonModule } from '@angular/common';
import { DynamicFormsModule } from './dynamic-forms/dynamic-forms-module/dynamic-forms.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonCustomModule } from '../common-custom.module';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [DynamicGridComponent],
  imports: [
    CommonModule,
    DynamicFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    TranslateModule,
    RouterModule,
    CommonCustomModule,
    DateTimePickerModule,
    IonicModule,
    NgxDatatableModule,
    DatePickerModule,
  ],
  providers: [ToastrComponent],
  exports: [DynamicGridComponent, DynamicFormsComponent],
})
export class DynamicModule {}
