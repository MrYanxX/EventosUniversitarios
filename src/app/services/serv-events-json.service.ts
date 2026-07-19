import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { TipoEvento } from '../models/tipoEvento.model';

@Injectable({
  providedIn: 'root'
})
export class ServEventsJsonService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7205/api'; 

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos`);
  }

  getEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/eventos/${id}`);
  }

  addEvento(evento: Evento): Observable<Evento> {
    const { id, ...nuevoEvento } = evento;
    return this.http.post<Evento>(`${this.apiUrl}/eventos`, nuevoEvento);
  }

  updateEvento(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/eventos/${evento.id}`, evento);
  }

  deleteEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eventos/${id}`);
  }

  getTipoEventos(): Observable<TipoEvento[]> {
    return this.http.get<TipoEvento[]>(`${this.apiUrl}/tiposevento`);
  }

  getTipoEventoPorId(id: number): Observable<TipoEvento> {
    return this.http.get<TipoEvento>(`${this.apiUrl}/tiposevento/${id}`);
  }
}