import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../../../models/field-config';
import { TranslateService } from '@ngx-translate/core';
import { CallApiService } from 'src/app/services/call-api.service';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { QuestionAlertComponent } from 'src/app/components/common/question-alert/question-alert.component';

@Component({
  selector: 'app-password-box',
  templateUrl: './password-box.component.html',
  styleUrls: ['./password-box.component.scss'],
  standalone: false
})
export class PasswordBoxComponent {
  @ViewChild(QuestionAlertComponent) alertQuestion: QuestionAlertComponent;
  public config: FieldConfig;
  public group: FormGroup;
  public basicPwdShow = false;

  constructor(
    private _service: CallApiService,
    private _toastr: ToastrComponent
  ) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {}

  showDialogConfirm() {
    this.alertQuestion.showQuestionAlert();
  }

  async generateNewPassword(dicision: any) {
    if (dicision) {
      (await this._service
        .callPostMethod('/api/superadmin/generateNewPassword', this.group.value))
        .subscribe((data: any) => {
          if (data) {
            this._toastr.showSuccess();
          }
        });
    }
    this.alertQuestion.closeQuestionAlert();
  }
}
