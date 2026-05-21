import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlerta } from './modal-alerta';

describe('ModalAlerta', () => {
  let component: ModalAlerta;
  let fixture: ComponentFixture<ModalAlerta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAlerta],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAlerta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
