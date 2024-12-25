import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ToastrComponent } from '../toastr/toastr.component';
import { ExplanationMarkComponent } from './dynamic-forms/dynamic-fields/common/explanation-mark/explanation-mark.component';
import { DynamicFormsComponent } from './dynamic-forms/dynamic-forms.component';
import { DynamicGridComponent } from './dynamic-grid/dynamic-grid.component';
import { CommonModule } from '@angular/common';
import { DynamicFormsModule } from './dynamic-forms/dynamic-forms-module/dynamic-forms.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonCustomModule } from '../common-custom.module';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DynamicGridComponent],
  imports: [
    CommonModule,
    DynamicFormsModule,
    FormsModule,
    NgbModule,
    // NgSelectModule,
    TranslateModule,
    RouterModule,
    CommonCustomModule,
    DateTimePickerModule,
    IonicModule,
  ],
  providers: [ToastrComponent],
  exports: [DynamicGridComponent],
})
export class DynamicModule {}
