import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonCustomModule } from '../common/common-custom.module';
import { NeedToApproveComponent } from './need-to-approve/need-to-approve.component';
import { SuccessComponent } from './success/success.component';
import { TranslateModule } from '@ngx-translate/core';

const routes = [
  {
    path: 'need-to-approve/:email',
    component: NeedToApproveComponent,
  },
  {
    path: 'need-to-approve',
    component: NeedToApproveComponent,
  },
  {
    path: 'not-active-yet/:email',
    component: NeedToApproveComponent,
  },
  {
    path: 'success',
    component: SuccessComponent,
  },
];

@NgModule({
  declarations: [
    NeedToApproveComponent,
    NeedToApproveComponent,
    SuccessComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CommonCustomModule,
    TranslateModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class PagesModule {}
