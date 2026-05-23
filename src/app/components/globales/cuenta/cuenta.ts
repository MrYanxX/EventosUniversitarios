import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Organizador } from '../../../models/organizador.model';
import { OrganizerUser } from '../../../models/usuarios';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cuenta.html',
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
    private http: HttpClient
  ) {}

  login(): void {
    this.mensajeLogin = '';
    if (!this.loginEmail || !this.loginPassword) {
      this.mensajeLogin = 'Ingrese correo y contraseña.';
      return;
    }

    if (this.authService.login(this.loginEmail, this.loginPassword)) {
      this.mensajeLogin = 'Inicio de sesión correcto.';
      this.router.navigate(['/home']);
    } else {
      this.mensajeLogin = 'Correo o contraseña incorrectos.';
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

  loginOrganizador(): void {
    this.mensajeOrg = '';
    if (!this.orgEmail || !this.orgPassword) {
      this.mensajeOrg = 'Ingrese correo y contraseña.';
      return;
    }
    this.http.get<Organizador[]>('json/organizadores.json').subscribe({
      next: (lista) => {
        const encontrado = lista.find(
          o =>
            o.email.toLowerCase() === this.orgEmail.toLowerCase() &&
            o.password === this.orgPassword &&
            o.activo
        );
        if (encontrado) {
          const user: OrganizerUser = { ...encontrado, tipo: 'organizador' };
          this.authService.loginOrganizador(user);
          this.router.navigate(['/dashboard-organizador']);
        } else {
          this.mensajeOrg = 'Credenciales incorrectas o cuenta inactiva.';
        }
      },
      error: () => {
        this.mensajeOrg = 'Error al cargar organizadores. Verifique que json-server esté activo.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
