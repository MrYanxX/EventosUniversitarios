import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInscripcion } from './modal-inscripcion';

describe('ModalInscripcion', () => {
  let component: ModalInscripcion;
  let fixture: ComponentFixture<ModalInscripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInscripcion],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInscripcion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
