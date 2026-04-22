import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateListPage } from './create-list-page';

describe('CreateListPage', () => {
  let component: CreateListPage;
  let fixture: ComponentFixture<CreateListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
