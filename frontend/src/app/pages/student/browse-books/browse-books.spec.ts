import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseBooks } from './browse-books';

describe('BrowseBooks', () => {
  let component: BrowseBooks;
  let fixture: ComponentFixture<BrowseBooks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseBooks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseBooks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
