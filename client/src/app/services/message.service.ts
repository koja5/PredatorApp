import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public configValue = new Subject<any>();
  public refreshAfterRemoveFile = new Subject<any>();

  constructor() {}

  getConfigValueEmit(): Observable<any> {
    return this.configValue.asObservable();
  }

  sendConfigValueEmit(value: any) {
    this.configValue.next(value);
  }

  sendRefreshGrid(value?: any) {
    this.refreshAfterRemoveFile.next(value);
  }

  getRefreshGrid(): Observable<any> {
    return this.refreshAfterRemoveFile.asObservable();
  }
}
