import { NgModule } from '@angular/core';
import { DynamicGridComponent } from './dynamic-grid.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IonicModule } from '@ionic/angular';
import { DynamicFieldsModule } from '../dynamic-fields/dynamic-fields.module';
@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule, NgbModule, DynamicFieldsModule],
  providers: [],
  bootstrap: [],
  exports: [],
})
export class DynamicGridModule {}
