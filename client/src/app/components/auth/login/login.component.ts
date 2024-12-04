import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CallApiService } from 'src/app/services/call-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public mode = '';
  public passwordField = 'password';
  public passwordFieldIcon = 'eye';
  public submited = false;
  public error: any;
  public loader = false;
  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  public signUpForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rePassword: ['', [Validators.required]],
  });
  public isAcceptTermsAndPrivacy = true;

  constructor(
    private _storageService: StorageService,
    private _service: CallApiService,
    private formBuilder: FormBuilder,
    private _roter: Router
  ) {}

  ngOnInit() {}

  changeMode() {
    if (this.mode === '') {
      this.error = null;
      this.mode = 'sign-up-mode';
    } else {
      this.mode = '';
    }
  }

  showHidePassword() {
    if (this.passwordField === 'password') {
      this.passwordField = 'text';
      this.passwordFieldIcon = 'eye-off';
    } else {
      this.passwordField = 'password';
      this.passwordFieldIcon = 'eye';
    }
  }

  login() {
    this.submited = false;
    this.loader = true;
    if (this.loginForm.valid) {
      this._service
        .callPostMethod('/api/auth/login', this.loginForm.value)
        .subscribe((data: any) => {
          this.loader = false;
          if (data && data.token) {
            this._storageService.setToken(data.token);
            this._roter.navigate(['/home/predators']);
          } else {
            if (data.type === 'active' && !data.value) {
              this._roter.navigate([
                '/page/need-to-approve/' + this.loginForm.value.email,
              ]);
            } else {
              this.error = data.type;
            }
          }
          this.submited = true;
        });
    }
    this.submited = true;
  }

  signUp() {
    this.submited = true;
    if (
      !this.signUpForm.valid ||
      this.signUpForm.value.password != this.signUpForm.value.rePassword ||
      !this.isAcceptTermsAndPrivacy
    )
      return;

    this._service
      .callPostMethod('/api/auth/signUp', this.signUpForm.value)
      .subscribe((data: any) => {
        this.submited = false;
        if (data.type) {
          this.error = data.type;
        } else {
          this.error = 'created-account';
          setTimeout(() => {
            this.mode = '';
          }, 2000);
        }
      });
  }
}
