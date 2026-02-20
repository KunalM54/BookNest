import { TestBed } from '@angular/core/testing';

import { Notice } from './notice';

describe('Notice', () => {
  let service: Notice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Notice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
