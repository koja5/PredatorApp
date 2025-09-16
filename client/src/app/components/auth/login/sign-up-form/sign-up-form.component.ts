import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CallApiService } from 'src/app/services/call-api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss'],
})
export class SignUpFormComponent implements OnInit {
  public mode = '';
  public passwordTextType = 'password';
  public passwordFieldIcon = 'eye';
  public error: any;
  public loader = false;
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
    return this.signUpForm.controls;
  }

  ngOnInit() {
    this.initSignUpForm();
    this.getAllAreas();
  }

  async getAllAreas() {
    (await this._service.callGetMethod('/api/auth/getAllAreas')).subscribe((data) => {
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

  async goToArea() {
    this.submitted = true;
    if (!this.signUpForm.valid) {
      this.error = 'fill-all-fields';
      return;
    }

    if (this.signUpForm.value.password != this.signUpForm.value.rePassword) {
      this.error = 'not-same-password';
      return;
    }

    this.signUpProcess = 'areas';

    if (!this.areas) {
      (await this._service.callGetMethod('/api/auth/getAllAreas')).subscribe((data) => {
        this.areas = data;
      });
    }
  }

  selectArea(item: any) {
    this.signUpForm.controls.id_area.setValue(item.id);
  }

  async signUp() {
    this.submitted = true;
    this.error = null;
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
            this.error = null;
            this.signUpProcess = 'profile';
            this._roter.navigate(['/auth/login']);
          }, 2000);
        }
      });
  }
}
