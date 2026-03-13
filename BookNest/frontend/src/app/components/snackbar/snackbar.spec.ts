import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Snackbar } from './snackbar';

describe('Snackbar', () => {
  let component: Snackbar;
  let fixture: ComponentFixture<Snackbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Snackbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Snackbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
