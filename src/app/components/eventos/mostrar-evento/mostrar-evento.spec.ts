import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarEvento } from './mostrar-evento';

describe('MostrarEvento', () => {
  let component: MostrarEvento;
  let fixture: ComponentFixture<MostrarEvento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarEvento],
    }).compileComponents();

    fixture = TestBed.createComponent(MostrarEvento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
