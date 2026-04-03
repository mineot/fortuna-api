import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagesPage } from './languages.page';

describe('Languages', () => {
  let component: LanguagesPage;
  let fixture: ComponentFixture<LanguagesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguagesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
