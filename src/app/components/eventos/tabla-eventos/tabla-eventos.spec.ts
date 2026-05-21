import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEventos } from './tabla-eventos';

describe('TablaEventos', () => {
  let component: TablaEventos;
  let fixture: ComponentFixture<TablaEventos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaEventos],
    }).compileComponents();

    fixture = TestBed.createComponent(TablaEventos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
