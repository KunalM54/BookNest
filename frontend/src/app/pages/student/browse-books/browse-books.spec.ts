import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseBooksComponent } from './browse-books';

describe('BrowseBooks', () => {
  let component: BrowseBooksComponent;
  let fixture: ComponentFixture<BrowseBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseBooksComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
