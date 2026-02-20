import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowRequests } from './borrow-requests';

describe('BorrowRequests', () => {
  let component: BorrowRequests;
  let fixture: ComponentFixture<BorrowRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
