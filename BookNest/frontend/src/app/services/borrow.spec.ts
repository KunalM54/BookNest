import { TestBed } from '@angular/core/testing';

import { Borrow } from './borrow';

describe('Borrow', () => {
  let service: Borrow;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Borrow);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
