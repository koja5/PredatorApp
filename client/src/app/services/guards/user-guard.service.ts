import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { HelpService } from '../help.service';
import { UserTypesEnum } from 'src/app/enums/user-types-enum';

@Injectable({
  providedIn: 'root',
})
export class UserGuardService {
  constructor(
    public _router: Router,
    public _storageService: StorageService,
    private _helpService: HelpService
  ) {}

  canActivate() {
    const user = this._storageService.getDecodeToken();
    if (user.type === UserTypesEnum.user) {
      return true;
    } else {
      this._helpService.setLocalStorage('previousLink', window.location.href);
      this._router.navigate(['./dashboard/miscellaneous/not-authorized']);
      return false;
    }
  }
}
