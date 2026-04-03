import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesPage } from './types.page';

describe('Types', () => {
  let component: TypesPage;
  let fixture: ComponentFixture<TypesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TypesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
