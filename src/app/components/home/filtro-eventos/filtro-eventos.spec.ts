import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroEventos } from './filtro-eventos';

describe('FiltroEventos', () => {
  let component: FiltroEventos;
  let fixture: ComponentFixture<FiltroEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltroEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
