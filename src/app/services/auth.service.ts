import { Injectable } from '@angular/core';
import { AppUser, OrganizerUser, StudentUser } from '../models/usuarios';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'eventos-usuarios';
  private readonly activeUserKey = 'usuario-activo';
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7205/api/Auth';

  registerStudent(user: StudentUser): { success: boolean; message: string } {
    const usuarios = this.getUsers();
    const existe = usuarios.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existe) {
      return { success: false, message: 'El correo ya está registrado.' };
    }
    usuarios.push(user);
    this.saveUsers(usuarios);
    localStorage.setItem(this.activeUserKey, JSON.stringify(user));
    return { success: true, message: 'Registro exitoso. Bienvenido, estudiante.' };
  }

login(email: string, password: string): Observable<any> {

  return this.http.post(`${this.apiUrl}/login`, {
    email,
    password
  });
  }

  guardarToken(token: string): void {
  localStorage.setItem('token', token);
}

obtenerToken(): string | null {
  return localStorage.getItem('token');
}

logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem(this.activeUserKey);
}

  loginOrganizador(org: OrganizerUser): void {
    localStorage.setItem(this.activeUserKey, JSON.stringify(org));
  }

  getCurrentUser(): AppUser | null {
    const raw = localStorage.getItem(this.activeUserKey);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  }

isLoggedIn(): boolean {
  return !!this.obtenerToken();
}

  isOrganizador(): boolean {
    return this.getCurrentUser()?.tipo === 'organizador';
  }

  private getUsers(): StudentUser[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as StudentUser[]) : [];
  }

  private saveUsers(users: StudentUser[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }
}
