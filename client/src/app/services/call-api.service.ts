import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelpService } from './help.service';
import { StorageService } from './storage.service';
import { RequestModel } from '../models/request.model';
import { ParameterTypeEnum } from '../enums/parameter-type-enum';
import { from, map, Observable, Subject } from 'rxjs';
import { isPlatform } from '@ionic/angular';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class CallApiService {
  private headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private helpService: HelpService,
    private _storageService: StorageService
  ) {
    this.headers = new HttpHeaders();
    this.headers.append('Access-Control-Allow-Origin', '*');
    this.headers.append(
      'Access-Control-Allow-Methods',
      'DELETE, POST, GET, OPTIONS'
    );
    this.headers.append(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
  }

  callApi(data: any, router?: any) {
    if (data && data.request && data.request.type === 'POST') {
      if (data.request.url) {
        data.body = this.helpService.postRequestDataParameters(
          data.body,
          router.snapshot.params,
          data.request.url
        );
      }
      return this.callPostMethod(
        data.request.api,
        data.body ? data.body : router.body
      );
    } else {
      if (data && data.request.url) {
        const dataValue = this.helpService.getRequestDataParameters(
          router.snapshot.params,
          data.request.url
        );
        return this.callGetMethod(data.request.api, dataValue);
      } else if (data.request.parametarsDate) {
        if (data.request.parametarsDate[0].type === 'localStorage') {
          const dataValue = this.helpService.getRequestDataParameters(
            this._storageService.getLocalStorage(
              data.request.parametarsDate[0].key
            ),
            data.request.parametarsDate[0].property,
            data.request.parameterType
          );
          return this.callGetMethod(data.request.api, dataValue);
        }
      } else {
        let dataValue = '';
        if (router && router.snapshot && data && data.request) {
          dataValue = this.helpService.getRequestDataParameters(
            router.snapshot.params,
            data.request.parameters
          );
          return this.callGetMethod(data.request.api, dataValue);
        } else if (data && data.request) {
          return this.callGetMethod(data.request.api, dataValue);
        } else {
          return this.callGetMethod(router.api, dataValue);
        }
      }
    }
    return new Subject();
  }

  callServerMethod(request: any, data: any, router?: any) {
    if (request.url) {
      data = this.helpService.postRequestDataParameters(
        data,
        router.snapshot.params,
        request.url
      );
    }
    if (request.type === 'POST') {
      return this.callPostMethod(request.api, data);
    } else {
      return this.callGetMethod(request.api, data);
    }
  }

  // callPostMethod(
  //   api: string,
  //   data?: any,
  //   serializeType?: string,
  //   headerMapValues?: Map<string, string>
  // ) {
  //   if (serializeType) {
  //     this.setSerializerType(serializeType);
  //   }
  //   if (headerMapValues) {
  //     this.createHeader(headerMapValues);
  //   }

  //   return this.HTTP2.post(api, data, { 'content-type': 'application/json' });
  // }

  // private setSerializerType(serializerType: string) {
  //   switch (serializerType) {
  //     case 'json':
  //       this.HTTP2.setDataSerializer('json');
  //       break;
  //     case 'multipart':
  //       this.HTTP2.setDataSerializer('multipart');
  //       break;
  //     case 'raw':
  //       this.HTTP2.setDataSerializer('raw');
  //       break;
  //     case 'urlencoded':
  //       this.HTTP2.setDataSerializer('urlencoded');
  //       break;
  //     case 'utf8':
  //       this.HTTP2.setDataSerializer('utf8');
  //       break;
  //     default:
  //       console.log('please set correct serialize type');
  //   }
  // }

  // public setHeader(http: HTTP, map: Map<string, string>) {
  //   map.forEach((value: string, key: string) => {
  //     http.setHeader('*', key, value);
  //   });
  // }
  // public createHeaderValues(): Map<string, string> {
  //   const map = new Map<string, string>();
  //   map.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  //   map.set('content-type', 'application/json');
  //   return map;
  // }

  // public createGetHeaderValues(): Map<string, string> {
  //   const map = new Map<string, string>();
  //   map.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  //   map.set('content-type', 'application/json');
  //   return map;
  // }

  // public createHeader(map: Map<string, string>) {
  //   this.setHeader(this.HTTP2, map);
  // }
  callPostMethod(api: string, data?: any) {
    if (isPlatform('capacitor')) {
      const url = 'https://praedatoren.app' + api;

      let options: HttpOptions = {
        url,
        data: data,
      };

      if (this._storageService.getToken()) {
        options['headers'] = {
          Authorization: `Bearer ${this._storageService.getToken()}`,
          'Content-Type': 'application/json',
        };
      } else {
        options['headers'] = {
          Authorization: 'Basic writeKey:password',
          'Content-Type': 'application/json',
        };
      }

      return from(CapacitorHttp.post(options)).pipe(map((data) => data.data));
    } else {
      return this.http.post(api, data, { headers: this.headers });
    }
  }

  callGetMethod(api: string, data?: any) {
    if (data === undefined) {
      data = '';
    }
    const link = api.endsWith('/') ? api + data : data ? api + '/' + data : api;

    if (isPlatform('capacitor')) {
      const url = 'https://praedatoren.app' + link;
      const options: HttpOptions = {
        url,
        headers: {
          Authorization: `Bearer ${this._storageService.getToken()}`,
          'Content-Type': 'application/json',
        },
      };

      return from(CapacitorHttp.get(options)).pipe(map((data) => data.data));
    } else {
      return this.http.get(link, { headers: this.headers });
    }
  }

  getPostRequest(api: string, data: any) {
    if (isPlatform('capacitor')) {
      const options = {
        url: 'https://praedatoren.app/' + api,
        data: data,
      };
      return CapacitorHttp.post(options).then((res) => {
        return res;
      });
    } else {
      return this.http.post(api, data, { headers: this.headers });
    }
  }

  getDocument(body: any) {
    return this.http.post('/api/upload/getDocument', body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
    });
  }

  packParametarPost(data: any, fields: any) {
    let model = {} as any;
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        model[fields[i].name] = data[fields[i].path];
      }
      return model;
    } else {
      return {};
    }
  }

  packParametarGet(data: any, fields: any) {
    let model = [];
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        model.push(data[fields[i]]);
      }
    }

    return model.toString();
  }

  buildParameterDate(request: RequestModel, data?: any) {
    let body = {};
    if (request.fields) {
      if (request.type === 'POST') {
        body = this.packParametarPost(data, request.fields);
      } else {
        body = this.packParametarGet(data, request.fields);
      }
    }
    if (request.parametarsDate) {
      for (let i = 0; i < request.parametarsDate.length; i++) {
        if (
          request.parametarsDate[i].type === ParameterTypeEnum.local_storage
        ) {
          body =
            this._storageService.getParametarsDateFromLocalStorageForApiRequest(
              request.parametarsDate[i],
              body
            );
        }
      }
    }
    return body;
  }
}
