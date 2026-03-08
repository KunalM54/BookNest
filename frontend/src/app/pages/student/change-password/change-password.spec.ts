import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordStudent } from './change-password';

describe('ChangePassword', () => {
  let component: ChangePasswordStudent;
  let fixture: ComponentFixture<ChangePasswordStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordStudent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
