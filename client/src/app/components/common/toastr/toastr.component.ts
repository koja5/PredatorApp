import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss'],
})
export class ToastrComponent implements OnInit {
  private language: any;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  showSuccessCustom(title: string, text?: string) {
    this.toastr.success(title, text, {
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
    });
  }

  showInfoCustom(title: string, text?: string) {
    this.toastr.info(title, text, {
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
    });
  }

  showErrorCustom(title: string, text?: string) {
    this.toastr.error(title, text, {
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
    });
  }
  showWarningCustom(title: string, text?: string) {
    this.toastr.warning(title, text, {
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
    });
  }

  showSuccess() {
    this.toastr.success(
      this.translate.instant('actionMessage.successExecuteActionTextDefault'),
      this.translate.instant('actionMessage.successExecuteActionTitleDefault'),
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-center',
      }
    );
  }

  showInfo() {
    this.toastr.info('Your action executed successfuly!', '', {
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
    });
  }

  showError() {
    this.toastr.error(
      this.translate.instant('actionMessage.errorExecuteActionTitleDefault'),
      this.translate.instant('actionMessage.errorExecuteActionTextDefault'),
      {
        timeOut: 7000,
        positionClass: 'toast-bottom-center',
      }
    );
  }
  showWarning() {
    const language = JSON.parse(localStorage.getItem('language') ?? '{}');
    this.toastr.warning(language.generalErrorExecuteAction, '', {
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
    });
  }
}
