import { Injectable } from '@angular/core';
import { AppUser, OrganizerUser, StudentUser } from '../models/usuarios';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'eventos-usuarios';
  private readonly activeUserKey = 'usuario-activo';

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

  login(email: string, password: string): boolean {
    const usuarios = this.getUsers();
    const usuario = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!usuario) {
      return false;
    }
    localStorage.setItem(this.activeUserKey, JSON.stringify(usuario));
    return true;
  }

  logout(): void {
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
    return !!this.getCurrentUser();
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
