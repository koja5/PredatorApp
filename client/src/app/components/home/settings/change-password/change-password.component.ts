import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrComponent } from 'src/app/components/common/toastr/toastr.component';
import { CallApiService } from 'src/app/services/call-api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: false,
})
export class ChangePasswordComponent implements OnInit {
  public path = 'forms/user';
  public file = 'change-password.json';
  public data = {
    password: '',
    new_password: '',
    re_new_password: ''
  }

  constructor(
    private _toastr: ToastrComponent,
    private _translate: TranslateService,
    private _service: CallApiService
  ) {}

  ngOnInit() {}

  async submit() {
    if (this.data.new_password != this.data.re_new_password) {
      this._toastr.showErrorCustom(
        this._translate.instant('changePassword.passwordsNeedToBeSame')
      );
      return;
    }

    (await this._service
      .callGetMethod('api/user/checkOldPassword', this.data.password))
      .subscribe(async (data: any) => {
        if (data) {
          (await this._service
            .callPostMethod('api/user/setMyPassword', this.data))
            .subscribe((data: any) => {
              if (data) {
                this._toastr.showSuccessCustom(
                  this._translate.instant(
                    'changePassword.successfullyChangedPassword'
                  )
                );
              } else {
                this._toastr.showError();
              }
            });
        } else {
          this._toastr.showErrorCustom(
            this._translate.instant('changePassword.currentPasswordIsNotGood')
          );
        }
      });
  }
}
