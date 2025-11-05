import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';
import { ParameterTypeEnum } from '../enums/parameter-type-enum';

import { Preferences } from '@capacitor/preferences';

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

  // 🍎 koristi Preferences za iOS/Android, cookies samo za web
  async setToken(token: string) {
    if (this.isNative()) {
      await Preferences.set({ key: 'token', value: token });
    } else {
      this.cookieService.put('token', token, {
        expires: new Date(new Date().getTime() + 86400000),
        sameSite: 'lax',
      });
    }
  }

  async getToken(): Promise<string> {
    if (this.isNative()) {
      const { value } = await Preferences.get({ key: 'token' });
      return value || '';
    }
    return this.cookieService.get('token') || '';
  }

  async deleteToken() {
    if (this.isNative()) {
      await Preferences.remove({ key: 'token' });
    } else {
      this.cookieService.remove('token');
    }
  }

  async getDecodeToken() {
    const token = await this.getToken();
    if (token) {
      return this.helper.decodeToken(token).user;
    }
    return false;
  }

  async setLocalStorage(key: string, value: any) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
    if (this.isNative()) {
      await Preferences.set({ key, value: stringValue });
    } else {
      localStorage.setItem(key, stringValue);
    }
  }

  async getLocalStorage(key: string) {
    if (this.isNative()) {
      const { value } = await Preferences.get({ key });
      if (!value) return null;
      return this.safeParse(value);
    }
    const storage = localStorage.getItem(key);
    return this.safeParse(storage);
  }

  async removeLocalStorage(key: string) {
    if (this.isNative()) {
      await Preferences.remove({ key });
    } else {
      localStorage.removeItem(key);
    }
  }

  async removeLocalStorageAll() {
    if (this.isNative()) {
      await Preferences.clear();
    } else {
      localStorage.clear();
    }
  }

  async getParametarsDateFromLocalStorageForApiRequest(params: any, body?: any) {
    if (!body) body = {};
    if (params.type === ParameterTypeEnum.local_storage) {
      const storage: any = await this.getLocalStorage(params.key);
      if (storage) {
        for (let i = 0; i < params.property.length; i++) {
          body[params.property[i]] = storage[params.property[i]];
        }
      }
    }
    return body;
  }

  async getSelectedLanguage(check?: boolean) {
    const config: any = await this.getLocalStorage('config');
    if (config) {
      if (config.app.appLanguage === 'rs' && check) {
        return 'sr-Latn';
      }
      return config.app.appLanguage;
    }
    return 'de';
  }

  private safeParse(value: string | null) {
    if (!value) return null;
    try {
      return value.startsWith('{') || value.startsWith('[')
        ? JSON.parse(value)
        : value;
    } catch {
      return value;
    }
  }

  private isNative(): boolean {
    return !!(window as any).Capacitor?.isNativePlatform?.();
  }
}
