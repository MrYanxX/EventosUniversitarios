import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Organizador } from '../models/organizador.model';
import { DashboardOrganizadores } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class OrganizadorService {
  /** URL base del backend .NET (UEventoBackend). */
  private readonly apiUrl = 'https://localhost:7205/api/organizadores';

  private http = inject(HttpClient);

  /** Cache local para que las plantillas puedan leer la lista de forma sincrona. */
  private organizadores: Organizador[] = [];

  // ---------- Lectura ----------

  /** GET /api/organizadores */
  cargar(): Observable<Organizador[]> {
    return this.http.get<Organizador[]>(this.apiUrl).pipe(
      tap(data => (this.organizadores = data))
    );
  }

  /** Devuelve la lista ya cargada en memoria (sin ir al servidor). */
  getAll(): Organizador[] {
    return this.organizadores;
  }

  /** GET /api/organizadores/{id} */
  getPorId(id: number): Observable<Organizador> {
    return this.http.get<Organizador>(`${this.apiUrl}/${id}`);
  }

  // ---------- Escritura ----------

  /** POST /api/organizadores */
  agregar(datos: Omit<Organizador, 'id'>): Observable<Organizador> {
    return this.http.post<Organizador>(this.apiUrl, datos).pipe(
      tap(creado => this.organizadores.push(creado))
    );
  }

  /** PUT /api/organizadores/{id} */
  actualizar(org: Organizador): Observable<Organizador> {
    return this.http.put<Organizador>(`${this.apiUrl}/${org.id}`, org).pipe(
      tap(actualizado => {
        const idx = this.organizadores.findIndex(o => o.id === actualizado.id);
        if (idx !== -1) this.organizadores[idx] = actualizado;
      })
    );
  }

  /** DELETE /api/organizadores/{id} */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => (this.organizadores = this.organizadores.filter(o => o.id !== id)))
    );
  }

  // ---------- Login y dashboard ----------

  /**
   * POST /api/organizadores/login
   * Reemplaza la antigua validacion en el cliente (buscarCredenciales).
   * El backend responde 401 si las credenciales son invalidas o la cuenta esta inactiva.
   */
  login(email: string, password: string): Observable<Organizador> {
    return this.http.post<Organizador>(`${this.apiUrl}/login`, { email, password });
  }

  /** GET /api/organizadores/dashboard */
  getDashboard(): Observable<DashboardOrganizadores> {
    return this.http.get<DashboardOrganizadores>(`${this.apiUrl}/dashboard`);
  }
}
