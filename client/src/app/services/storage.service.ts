import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { ParameterTypeEnum } from '../enums/parameter-type-enum';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  helper = new JwtHelperService();

  constructor(private cookieService: CookieService) {}

  encrypt(value: any) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(value),
      environment.ENCRIPTY_KEY
    ).toString();
  }

  decrypt(value: any) {
    return CryptoJS.AES.decrypt(value, environment.ENCRIPTY_KEY).toString(
      CryptoJS.enc.Utf8
    );
  }

  setToken(token: any) {
    this.cookieService.put('token', token, {
      expires: new Date(new Date().getTime() + 86400000),
      sameSite: 'lax',
    });
  }

  getToken() {
    return this.cookieService.get('token');
  }

  getDecodeToken() {
    if (this.getToken()) {
      return this.helper.decodeToken(this.getToken()!).user;
    }
    return false;
  }

  getLocalStorage(key: string) {
    const storage = localStorage.getItem(key);
    if (storage?.startsWith('{') && storage?.endsWith('}')) {
      return JSON.parse(storage);
    } else {
      return storage;
    }
  }

  getParametarsDateFromLocalStorageForApiRequest(params: any, body?: any) {
    if (!body) {
      body = {};
    }
    if (params.type === ParameterTypeEnum.local_storage) {
      const storage = this.getLocalStorage(params.key);
      for (let i = 0; i < params.property.length; i++) {
        body[params.property[i]] = storage[params.property[i]];
      }
    }
    return body;
  }
}
