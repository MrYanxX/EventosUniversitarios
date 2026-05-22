import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  mensajeLogin = '';
  mensajeRegistro = '';

  constructor(public authService: AuthService, private router: Router) {}

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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
