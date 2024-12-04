import { Component, OnInit } from '@angular/core';
import { CallApiService } from 'src/app/services/call-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ResponseMessageModel } from 'src/app/models/response-message.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public submited = false;
  public responseMessage = new ResponseMessageModel();
  public loader = false;
  public passwordField = 'password';
  public passwordFieldIcon = 'eye';
  public form = this.formBuilder.group({
    password: ['', [Validators.required]],
    rePassword: ['', [Validators.required]],
  });

  constructor(
    private _service: CallApiService,
    private formBuilder: FormBuilder,
    private _roter: Router,
    private _activatedRouter: ActivatedRoute,
    private _translate: TranslateService
  ) {}

  ngOnInit() {}

  showHidePassword() {
    if (this.passwordField === 'password') {
      this.passwordField = 'text';
      this.passwordFieldIcon = 'eye-off';
    } else {
      this.passwordField = 'password';
      this.passwordFieldIcon = 'eye';
    }
  }

  resetPassword() {
    this.submited = false;
    if (this.form.valid) {
      if (this.form.value.password != this.form.value.rePassword) {
        this.responseMessage.value = false;
        this.responseMessage.message = this._translate.instant(
          'login.bothPasswordNeedToBeSame'
        );
        return;
      }
      this._service
        .callPostMethod('/api/auth/resetPassword', {
          email: this._activatedRouter.snapshot.params.email,
          password: this.form.value.password,
        })
        .subscribe((data: any) => {
          if (data) {
            this.responseMessage = {
              value: true,
              message: this._translate.instant(
                'login.successfullyResetPassword'
              ),
            };
            setTimeout(() => {
              this._roter.navigate(['/auth/login']);
            }, 3000);
          }
        });
    }
    this.submited = true;
  }
}
