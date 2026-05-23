import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeerRecursos } from './leer-recursos';

describe('LeerRecursos', () => {
  let component: LeerRecursos;
  let fixture: ComponentFixture<LeerRecursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeerRecursos],
    }).compileComponents();

    fixture = TestBed.createComponent(LeerRecursos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
