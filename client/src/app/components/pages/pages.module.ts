import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonCustomModule } from '../common/common-custom.module';
import { NeedToApproveComponent } from './need-to-approve/need-to-approve.component';

const routes = [
  {
    path: 'need-to-approve/:email',
    component: NeedToApproveComponent,
  },
  {
    path: 'not-active-yet/:email',
    component: NeedToApproveComponent,
  },
];

@NgModule({
  declarations: [NeedToApproveComponent, NeedToApproveComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CommonCustomModule,
  ],
  providers: [],
  exports: [RouterModule],
})
export class PagesModule {}
