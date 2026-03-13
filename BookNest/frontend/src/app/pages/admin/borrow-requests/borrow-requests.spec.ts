import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowRequestsComponent } from './borrow-requests';

describe('BorrowRequests', () => {
  let component: BorrowRequestsComponent;
  let fixture: ComponentFixture<BorrowRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowRequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
