import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { OrganizadorService } from '../../../services/organizador.service';
import { OrganizerUser } from '../../../models/usuarios';
import { DashboardOrganizadores } from '../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard-organizador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-organizador.html',
  styleUrls: ['./dashboard-organizador.css']
})
export class DashboardOrganizador implements OnInit {
  organizador: OrganizerUser | null = null;

  /** Estadisticas que llegan de GET /api/organizadores/dashboard */
  estadisticas: DashboardOrganizadores | null = null;
  cargandoEstadisticas = false;
  errorEstadisticas = '';

  constructor(
    private authService: AuthService,
    private orgService: OrganizadorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.tipo !== 'organizador') {
      this.router.navigate(['/cuenta']);
      return;
    }
    this.organizador = user as OrganizerUser;
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargandoEstadisticas = true;
    this.errorEstadisticas = '';

    this.orgService.getDashboard().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.cargandoEstadisticas = false;
      },
      error: (err: HttpErrorResponse) => {
        this.cargandoEstadisticas = false;
        this.errorEstadisticas =
          err.status === 0
            ? 'No se pudo conectar con el servidor. Verifique que el backend este ejecutandose.'
            : 'No se pudieron cargar las estadisticas.';
      }
    });
  }

  /** Porcentaje de un conteo respecto al total, para las barras de progreso. */
  porcentaje(cantidad: number): number {
    const total = this.estadisticas?.total ?? 0;
    return total === 0 ? 0 : Math.round((cantidad / total) * 100);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
