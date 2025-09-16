import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserTypesEnum } from 'src/app/enums/user-types-enum';
import { CallApiService } from 'src/app/services/call-api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss'],
})
export class SignInFormComponent implements OnInit {
  public mode = '';
  public passwordTextType = 'password';
  public passwordFieldIcon = 'eye';
  public error: any;
  public loader = false;
  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  public signUpForm: FormGroup;
  public areas: any;
  public isAcceptTermsAndPrivacy = true;
  public signUpProcess = 'profile';
  public submitted = false;

  constructor(
    private _storageService: StorageService,
    private _service: CallApiService,
    private formBuilder: FormBuilder,
    private _router: Router
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {}

  changeMode() {
    if (this.mode === '') {
      this.error = null;
      this.mode = 'sign-up-mode';
    } else {
      this.mode = '';
    }
  }

  togglePasswordTextType() {
    if (this.passwordTextType === 'password') {
      this.passwordTextType = 'text';
      this.passwordFieldIcon = 'eye-off';
    } else {
      this.passwordTextType = 'password';
      this.passwordFieldIcon = 'eye';
    }
  }

  async login() {
    this.submitted = false;
    this.loader = true;
    this.error = null;
    if (this.loginForm.valid) {
      (await this._service
        .callPostMethod('/api/auth/login', this.loginForm.value))
        .subscribe(async (data: any) => {
          this.loader = false;
          if (data && data.token) {
            console.log(data.token);
            console.log('TOKEN JE DOBAR!');
            this._storageService.setToken(data.token);
            console.log("Sacuvao sam token:");
            const token1 = await this._storageService.getToken();
            console.log(token1);
            // const type = this._storageService.getDecodeToken()
            //   .type as UserTypesEnum;
            // console.log(type);
            // const previousLink =
            //   this._storageService.getLocalStorage('previousLink');
            // if (previousLink) {
            //   window.open(previousLink, '_self');
            //   this._storageService.removeLocalStorage('previousLink');
            // } else if (type === UserTypesEnum.superadmin) {
            //   this._router.navigate(['/superadmin/all-admins']);
            // } else {
            //   this._router.navigate(['/home/predators']);
            // }
            this._router.navigate(['/home/predators']);
          } else {
            if (data.type === 'active' && !data.value) {
              this._router.navigate([
                '/page/need-to-approve/' + this.loginForm.value.email,
              ]);
            } else {
              this.error = data.type;
            }
          }
          this.submitted = true;
        });
    }
    this.submitted = true;
  }
}
