import { Injectable } from '@angular/core';
import { CallApiService } from 'src/app/services/call-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _service: CallApiService) {}

  login(data: any) {
    this._service.callPostMethod('/api/auth/login', data)?.subscribe((data) => {
      return data;
    });
  }
}
