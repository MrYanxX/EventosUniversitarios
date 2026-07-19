import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { OrganizadorService } from '../../../services/organizador.service';
import { OrganizerUser } from '../../../models/usuarios';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './estudiante.html',
  styleUrl: './cuenta.css',
})
export class CuentaComponent {
  loginEmail = '';
  loginPassword = '';

  regNombre = '';
  regEmail = '';
  regPassword = '';
  regCarrera = '';

  orgEmail = '';
  orgPassword = '';

  mensajeLogin = '';
  mensajeRegistro = '';
  mensajeOrg = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private orgService: OrganizadorService
  ) {}

  login(): void {
    this.mensajeLogin = '';
    if (!this.loginEmail || !this.loginPassword) {
      this.mensajeLogin = 'Ingrese correo y contrasena.';
      return;
    }

    if (this.authService.login(this.loginEmail, this.loginPassword)) {
      this.mensajeLogin = 'Inicio de sesion correcto.';
      this.router.navigate(['/home']);
    } else {
      this.mensajeLogin = 'Correo o contrasena incorrectos.';
    }
  }

  register(): void {
    this.mensajeRegistro = '';
    if (!this.regNombre || !this.regEmail || !this.regPassword) {
      this.mensajeRegistro = 'Complete los datos de registro.';
      return;
    }

    const result = this.authService.registerStudent({
      nombre: this.regNombre,
      email: this.regEmail,
      password: this.regPassword,
      carrera: this.regCarrera,
      tipo: 'estudiante',
    });

    this.mensajeRegistro = result.message;
    if (result.success) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Login de organizador contra el backend (.NET).
   * Antes se leia json/organizadores.json y se comparaba en el navegador;
   * ahora la validacion la hace el servidor en POST /api/organizadores/login.
   */
  loginOrganizador(): void {
    this.mensajeOrg = '';
    if (!this.orgEmail || !this.orgPassword) {
      this.mensajeOrg = 'Ingrese correo y contrasena.';
      return;
    }

    this.orgService.login(this.orgEmail, this.orgPassword).subscribe({
      next: (organizador) => {
        const user: OrganizerUser = { ...organizador, tipo: 'organizador' };
        this.authService.loginOrganizador(user);
        this.router.navigate(['/dashboard-organizador']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.mensajeOrg = 'Credenciales incorrectas o cuenta inactiva.';
        } else if (err.status === 0) {
          this.mensajeOrg = 'No se pudo conectar con el servidor. Verifique que el backend este ejecutandose.';
        } else {
          this.mensajeOrg = 'Ocurrio un error al iniciar sesion. Intente nuevamente.';
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}