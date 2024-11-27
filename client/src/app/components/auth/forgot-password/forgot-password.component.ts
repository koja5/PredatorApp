import { Component, OnInit } from '@angular/core';
import { CallApiService } from 'src/app/services/call-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ResponseMessageModel } from 'src/app/models/response-message.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public submited = false;
  public responseMessage = new ResponseMessageModel();
  public loader = false;
  public form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private _storageService: StorageService,
    private _service: CallApiService,
    private formBuilder: FormBuilder,
    private _roter: Router,
    private _translate: TranslateService
  ) {}

  ngOnInit() {}

  forgotPassword() {
    this.submited = false;
    if (this.form.valid) {
      this._service
        .callPostMethod('api/auth/forgotPassword', this.form.value)
        .subscribe((data) => {
          if (data) {
            this.responseMessage = {
              value: true,
              message: this._translate.instant(
                'login.sendEmailForRecoveryMessage'
              ),
            };
            setTimeout(() => {
              this._roter.navigate(['/auth/login']);
            }, 3000);
          } else {
            this.responseMessage = {
              value: false,
              message: this._translate.instant('login.emailNotExist'),
            };
          }
        });
    }
    this.submited = true;
  }
}
