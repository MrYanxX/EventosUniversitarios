import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEstudiantes } from './dashboard-estudiantes';

describe('DashboardEstudiantes', () => {
  let component: DashboardEstudiantes;
  let fixture: ComponentFixture<DashboardEstudiantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEstudiantes],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEstudiantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
