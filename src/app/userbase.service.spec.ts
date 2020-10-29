import { TestBed } from '@angular/core/testing';

import { UserbaseService } from './userbase.service';

describe('UserbaseService', () => {
  let service: UserbaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserbaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
