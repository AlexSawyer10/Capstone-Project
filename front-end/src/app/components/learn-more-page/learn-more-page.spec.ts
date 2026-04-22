import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnMorePage } from './learn-more-page';

describe('LearnMorePage', () => {
  let component: LearnMorePage;
  let fixture: ComponentFixture<LearnMorePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnMorePage],
    }).compileComponents();

    fixture = TestBed.createComponent(LearnMorePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
