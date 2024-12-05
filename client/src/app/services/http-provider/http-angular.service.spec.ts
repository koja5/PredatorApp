import { TestBed } from '@angular/core/testing';

import { HttpAngularService } from './http-angular.service';

describe('HttpAngularService', () => {
  let service: HttpAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
