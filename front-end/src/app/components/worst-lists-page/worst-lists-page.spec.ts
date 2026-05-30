import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorstListsPage } from './worst-lists-page';

describe('WorstListsPage', () => {
  let component: WorstListsPage;
  let fixture: ComponentFixture<WorstListsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorstListsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WorstListsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
