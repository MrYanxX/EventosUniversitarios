import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEventos } from './form-eventos';

describe('FormEventos', () => {
  let component: FormEventos;
  let fixture: ComponentFixture<FormEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(FormEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
