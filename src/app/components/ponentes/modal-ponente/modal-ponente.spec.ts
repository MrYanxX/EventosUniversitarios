import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPonente } from './modal-ponente';

describe('ModalPonente', () => {
  let component: ModalPonente;
  let fixture: ComponentFixture<ModalPonente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPonente],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPonente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
