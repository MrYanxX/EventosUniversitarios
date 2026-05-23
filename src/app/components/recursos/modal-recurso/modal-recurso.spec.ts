import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecurso } from './modal-recurso';

describe('ModalRecurso', () => {
  let component: ModalRecurso;
  let fixture: ComponentFixture<ModalRecurso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRecurso],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRecurso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
