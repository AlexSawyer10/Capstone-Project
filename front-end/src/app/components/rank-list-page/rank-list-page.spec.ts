import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankListPage } from './rank-list-page';

describe('RankListPage', () => {
  let component: RankListPage;
  let fixture: ComponentFixture<RankListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(RankListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
