import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeContenedor } from './home-contenedor';

describe('HomeContenedor', () => {
  let component: HomeContenedor;
  let fixture: ComponentFixture<HomeContenedor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeContenedor],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeContenedor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
