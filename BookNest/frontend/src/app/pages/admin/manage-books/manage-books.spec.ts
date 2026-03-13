import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBooksComponent } from './manage-books';

describe('ManageBooks', () => {
  let component: ManageBooksComponent;
  let fixture: ComponentFixture<ManageBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBooksComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
