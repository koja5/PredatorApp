import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { HttpAngularService } from './http-angular.service';
import { HttpNativeService } from './http-native.service';

@Injectable({
  providedIn: 'root',
})
export class HttpProviderService {
  public http: HttpAngularService | HttpNativeService;

  constructor(
    private platform: Platform,
    private angularHttp: HttpAngularService,
    private nativeHttp: HttpNativeService
  ) {
    this.http =
      this.platform.is('ios') || this.platform.is('android')
        ? this.nativeHttp
        : this.angularHttp;
  }
}
