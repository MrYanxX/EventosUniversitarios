import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaEventos } from './tarjeta-eventos';

describe('TarjetaEventos', () => {
  let component: TarjetaEventos;
  let fixture: ComponentFixture<TarjetaEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
