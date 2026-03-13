import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesComponent } from './notices';

describe('Notices', () => {
  let component: NoticesComponent;
  let fixture: ComponentFixture<NoticesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
