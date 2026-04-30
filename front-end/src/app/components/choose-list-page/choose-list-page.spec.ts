import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseListPage } from './choose-list-page';

describe('ChooseListPage', () => {
  let component: ChooseListPage;
  let fixture: ComponentFixture<ChooseListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
