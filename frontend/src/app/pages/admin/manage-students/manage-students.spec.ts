import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStudents } from './manage-students';

describe('ManageStudents', () => {
  let component: ManageStudents;
  let fixture: ComponentFixture<ManageStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStudents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStudents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
