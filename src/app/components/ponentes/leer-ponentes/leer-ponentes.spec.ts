import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeerPonentes } from './leer-ponentes';

describe('LeerPonentes', () => {
  let component: LeerPonentes;
  let fixture: ComponentFixture<LeerPonentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeerPonentes],
    }).compileComponents();

    fixture = TestBed.createComponent(LeerPonentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
