import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../storage.service';
import { UserTypesEnum } from 'src/app/enums/user-types-enum';

@Injectable({
  providedIn: 'root',
})
export class LoggedGuard {
  constructor(
    private _router: Router,
    private _storageService: StorageService
  ) {}

  canActivate() {
    if (!this._storageService.getToken()) {
      return true;
    } else {
      const token = this._storageService.getDecodeToken();
      const previousLink = this._storageService.getLocalStorage('previousLink');
      if (previousLink) {
        this._router.navigate([previousLink]);
        this._storageService.removeLocalStorage('previousLink');
      } else if (token.type === UserTypesEnum.superadmin) {
        this._router.navigate(['/dashboard/admin/all-users']);
      } else if (token.type === UserTypesEnum.user) {
        this._router.navigate(['home/predators']);
      }
      return false;
    }
  }
}
