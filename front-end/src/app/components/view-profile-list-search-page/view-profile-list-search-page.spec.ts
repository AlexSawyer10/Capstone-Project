import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfileListSearchPage } from './view-profile-list-search-page';

describe('ViewProfileListSearchPage', () => {
  let component: ViewProfileListSearchPage;
  let fixture: ComponentFixture<ViewProfileListSearchPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfileListSearchPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProfileListSearchPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
