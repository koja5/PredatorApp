import { NgModule } from '@angular/core';
import { DynamicGridComponent } from './dynamic-grid.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [DynamicGridComponent],
  imports: [CommonModule, TranslateModule],
  providers: [],
  bootstrap: [],
  exports: [DynamicGridComponent],
})
export class DynamicGridModule {}
