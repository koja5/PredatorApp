import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginGuardService {
  constructor(public _router: Router, public _storageService: StorageService) {}

  async canActivate() {
    if (await this._storageService.getToken()) {
      return true;
    } else {
      this._storageService.setLocalStorage(
        'previousLink',
        window.location.href.split(environment.DOMAIN)[1]
      );
      this._router.navigate(['/auth/login']);
      return false;
    }
  }
}
