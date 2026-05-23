import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Organizador } from '../models/organizador.model';

@Injectable({ providedIn: 'root' })
export class OrganizadorService {
  private readonly jsonUrl = 'json/organizadores.json';
  private organizadores: Organizador[] = [];

  constructor(private http: HttpClient) {}

  cargar(): Observable<Organizador[]> {
    return this.http.get<Organizador[]>(this.jsonUrl).pipe(
      tap(data => (this.organizadores = data))
    );
  }

  getAll(): Organizador[] {
    return this.organizadores;
  }

  agregar(datos: Omit<Organizador, 'id'>): Organizador {
    const nuevo: Organizador = { ...datos, id: Date.now() };
    this.organizadores.push(nuevo);
    return nuevo;
  }

  actualizar(org: Organizador): void {
    const idx = this.organizadores.findIndex(o => o.id === org.id);
    if (idx !== -1) this.organizadores[idx] = { ...org };
  }

  eliminar(id: number): void {
    this.organizadores = this.organizadores.filter(o => o.id !== id);
  }

  buscarCredenciales(email: string, password: string): Organizador | undefined {
    return this.organizadores.find(
      o =>
        o.email.toLowerCase() === email.toLowerCase() &&
        o.password === password &&
        o.activo
    );
  }
}
