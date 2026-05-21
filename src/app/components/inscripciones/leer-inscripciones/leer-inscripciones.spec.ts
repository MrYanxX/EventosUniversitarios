import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeerInscripciones } from './leer-inscripciones';

describe('LeerInscripciones', () => {
  let component: LeerInscripciones;
  let fixture: ComponentFixture<LeerInscripciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeerInscripciones],
    }).compileComponents();

    fixture = TestBed.createComponent(LeerInscripciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
