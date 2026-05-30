import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchListsPage } from './search-lists-page';

describe('SearchListsPage', () => {
  let component: SearchListsPage;
  let fixture: ComponentFixture<SearchListsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchListsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchListsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
