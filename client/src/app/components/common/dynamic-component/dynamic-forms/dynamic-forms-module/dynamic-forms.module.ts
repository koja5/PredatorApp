import { NgModule } from '@angular/core';
import { DynamicFormsComponent } from '../dynamic-forms.component';
import { DynamicFieldsDirective } from '../dynamic-fields/dynamic-fields.directive';
import { TextBoxComponent } from '../dynamic-fields/inputs/text-box/text-box.component';
import { PasswordBoxComponent } from '../dynamic-fields/inputs/text-box/password-box/password-box.component';
import { NumericTextboxComponent } from '../dynamic-fields/inputs/numeric-textbox/numeric-textbox.component';
import { LabelComponent } from '../dynamic-fields/label/label.component';
import { ButtonComponent } from '../dynamic-fields/buttons/button/button.component';
import { SwitchComponent } from '../dynamic-fields/buttons/switch/switch.component';
import { RadioComponent } from '../dynamic-fields/buttons/radio/radio.component';
import { ComboboxComponent } from '../dynamic-fields/dropdowns/combobox/combobox.component';
import { MultiselectComponent } from '../dynamic-fields/dropdowns/multiselect/multiselect.component';
import { ExplanationMarkComponent } from '../dynamic-fields/common/explanation-mark/explanation-mark.component';
import { DynamicRowsComponent } from '../dynamic-rows/dynamic-rows.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  DatePickerModule,
  DateTimePickerModule,
} from '@syncfusion/ej2-angular-calendars';
import { CommonCustomModule } from '../../../common-custom.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    DynamicFormsComponent,
    DynamicFieldsDirective,
    TextBoxComponent,
    PasswordBoxComponent,
    NumericTextboxComponent,
    LabelComponent,
    ButtonComponent,
    SwitchComponent,
    RadioComponent,
    ComboboxComponent,
    MultiselectComponent,
    ExplanationMarkComponent,
    DynamicRowsComponent,
  ],
  exports: [
    DynamicFormsComponent,
    DynamicFieldsDirective,
    TextBoxComponent,
    PasswordBoxComponent,
    NumericTextboxComponent,
    LabelComponent,
    ButtonComponent,
    SwitchComponent,
    RadioComponent,
    ComboboxComponent,
    MultiselectComponent,
    ExplanationMarkComponent,
    DynamicRowsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    IonicModule,
    TranslateModule,
    DatePickerModule,
    DateTimePickerModule,
    CommonCustomModule,
  ],
})
export class DynamicFormsModule {}
