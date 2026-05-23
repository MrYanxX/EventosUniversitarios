import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudRecursos } from './crud-recursos';

describe('CrudRecursos', () => {
  let component: CrudRecursos;
  let fixture: ComponentFixture<CrudRecursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudRecursos],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudRecursos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
