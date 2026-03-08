import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStudentsComponent } from './manage-students';

describe('ManageStudents', () => {
  let component: ManageStudentsComponent;
  let fixture: ComponentFixture<ManageStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStudentsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
