import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsStudent } from './requests';

describe('Requests', () => {
  let component: RequestsStudent;
  let fixture: ComponentFixture<RequestsStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsStudent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
