import { Injectable, inject } from '@angular/core';
import { AppUser, OrganizerUser, StudentUser } from '../models/usuarios';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly activeUserKey = 'usuario-activo';
  
  private http = inject(HttpClient);
  
  private apiUrl = 'https://localhost:7205/api/Estudiante';

  login(email: string, password: string): Observable<StudentUser> {
    return this.http.post<StudentUser>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((user) => {
        const studentUser: StudentUser = { ...user, tipo: 'estudiante' };
        localStorage.setItem(this.activeUserKey, JSON.stringify(studentUser));
      })
    );
  }

  // NUEVO: Ahora hace un POST real a la base de datos
  registerStudent(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user).pipe(
      tap((creado) => {
        // Opcional: Autologuear al usuario inmediatamente después de registrarse
        const studentUser: StudentUser = { ...creado, tipo: 'estudiante' };
        localStorage.setItem(this.activeUserKey, JSON.stringify(studentUser));
      })
    );
  }

  // LOGICA GENERAL Y ORGANIZADORES
  loginOrganizador(org: OrganizerUser): void {
    localStorage.setItem(this.activeUserKey, JSON.stringify(org));
  }

  getCurrentUser(): AppUser | null {
    const raw = localStorage.getItem(this.activeUserKey);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isOrganizador(): boolean {
    return this.getCurrentUser()?.tipo === 'organizador';
  }

  isEstudiante(): boolean {
    return this.getCurrentUser()?.tipo === 'estudiante';
  }

  logout(): void {
    localStorage.removeItem(this.activeUserKey);
  }
}