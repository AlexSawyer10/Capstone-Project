import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGamesPage } from './search-games-page';

describe('SearchGamesPage', () => {
  let component: SearchGamesPage;
  let fixture: ComponentFixture<SearchGamesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchGamesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchGamesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
