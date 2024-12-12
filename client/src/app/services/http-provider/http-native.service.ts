import { Injectable } from '@angular/core';
import { Http } from '@capacitor-community/http';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { HTTP } from '@ionic-native/http/ngx';
import { from, map } from 'rxjs';
import { StorageService } from '../storage.service';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpNativeService {
  constructor(
    public http: HTTP,
    private _storageService: StorageService,
    public http2: HttpClient
  ) {}

  public get(url: string, params?: any, options: any = {}) {
    let responseData = this.http
      .get(url, params, {})
      .then((resp: any) =>
        options.responseType == 'text' ? resp.data : JSON.parse(resp.data)
      );

    return from(responseData);
  }

  public post(url: any, params?: any) {
    let api = environment.DOMAIN + url;

    return axios.post(api, params, {
      headers: {
        Authorization: `Bearer ${this._storageService.getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
