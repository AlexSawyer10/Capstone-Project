import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopListsPage } from './top-lists-page';

describe('TopListsPage', () => {
  let component: TopListsPage;
  let fixture: ComponentFixture<TopListsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopListsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TopListsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
