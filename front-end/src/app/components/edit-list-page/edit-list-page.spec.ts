import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListPage } from './edit-list-page';

describe('EditListPage', () => {
  let component: EditListPage;
  let fixture: ComponentFixture<EditListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EditListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
