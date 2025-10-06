import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CallApiService } from 'src/app/services/call-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { UserTypesEnum } from 'src/app/enums/user-types-enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
    private _roter: Router
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    this.initSignUpForm();
    this.getAllAreas();
  }

  async getAllAreas() {
    (await this._service.callGetMethod('/api/auth/getAllAreas')).subscribe((data: any) => {
      this.areas = data;
    });
  }

  initSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rePassword: ['', [Validators.required]],
      id_area: [''],
    });
  }

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
    if (this.loginForm.valid) {
      (await this._service
        .callPostMethod('/api/auth/login', this.loginForm.value))
        .subscribe(async (data: any) => {
          this.loader = false;
          if (data && data.token) {
            this._storageService.setToken(data.token);

            let type = await this._storageService.getDecodeToken();
            if(type) {
              type = type.type as UserTypesEnum;
            }
            const previousLink =
              this._storageService.getLocalStorage('previousLink');
            if (previousLink) {
              window.open(await previousLink, '_self');
              this._storageService.removeLocalStorage('previousLink');
            } else if (type === UserTypesEnum.superadmin) {
              this._roter.navigate(['/superadmin/all-admins']);
            } else {
              this._roter.navigate(['/home/predators']);
            }
          } else {
            if (data.type === 'active' && !data.value) {
              this._roter.navigate([
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

  async goToArea() {
    this.submitted = true;
    if (
      !this.signUpForm.valid ||
      this.signUpForm.value.password != this.signUpForm.value.rePassword
    )
      return;

    this.signUpProcess = 'areas';

    if (!this.areas) {
      (await this._service.callGetMethod('/api/auth/getAllAreas')).subscribe((data: any) => {
        this.areas = data;
      });
    }
  }

  selectArea(item: any) {
    this.signUpForm.controls.id_area.setValue(item.id);
  }

  async signUp() {
    this.submitted = true;
    if (!this.signUpForm.valid || !this.signUpForm.value.id_area) return;

    (await this._service
      .callPostMethod('/api/auth/signUp', this.signUpForm.value))
      .subscribe((data: any) => {
        this.submitted = false;
        if (data.type) {
          this.error = data.type;
        } else {
          this.error = 'created-account';
          setTimeout(() => {
            this.mode = '';
            setTimeout(() => {
              this.signUpProcess = 'profile';
              this.initSignUpForm();
            }, 2000);
          }, 2000);
        }
      });
  }
}
