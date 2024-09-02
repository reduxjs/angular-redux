import { TestBed } from '@angular/core/testing';

import { AngularReduxService } from './angular-redux.service';

describe('AngularReduxService', () => {
  let service: AngularReduxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularReduxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
