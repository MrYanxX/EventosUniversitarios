import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPonentes } from './crud-ponentes';

describe('CrudPonentes', () => {
  let component: CrudPonentes;
  let fixture: ComponentFixture<CrudPonentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudPonentes],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudPonentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
