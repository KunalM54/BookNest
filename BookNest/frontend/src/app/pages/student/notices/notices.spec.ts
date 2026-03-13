import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesStudent } from './notices';

describe('Notices', () => {
  let component: NoticesStudent;
  let fixture: ComponentFixture<NoticesStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticesStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticesStudent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
