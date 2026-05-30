import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFullListEditPage } from './view-full-list-edit-page';

describe('ViewFullListEditPage', () => {
  let component: ViewFullListEditPage;
  let fixture: ComponentFixture<ViewFullListEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFullListEditPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewFullListEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
