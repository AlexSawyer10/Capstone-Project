import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFullListSearchPage } from './view-full-list-search-page';

describe('ViewFullListSearchPage', () => {
  let component: ViewFullListSearchPage;
  let fixture: ComponentFixture<ViewFullListSearchPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFullListSearchPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewFullListSearchPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
