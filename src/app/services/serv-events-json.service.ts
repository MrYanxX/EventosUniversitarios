import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { TipoEvento } from '../models/tipoEvento.model';

@Injectable({
  providedIn: 'root',
})
export class ServEventsJsonService {
  //endpoints para la api simulada
  private eventosUrl = 'http://127.0.0.1:3000/eventos'
  private tiposEventosUrl = 'http://127.0.0.1:3000/tiposEventos';
  
  constructor(private http: HttpClient) {}

  //Obtner todos los eventos
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.eventosUrl);
  }

  getEventoPorId(id:number): Observable<Evento> {
    return this.http.get<Evento>(`${this.eventosUrl}/${id}`);
  }

  addEvento(evento: Evento) : Observable<Evento> {
    return this.http.post<Evento>(this.eventosUrl, evento);
  }

  updateEvento(evento: Evento) : Observable<Evento> {
    return this.http.put<Evento>(`${this.eventosUrl}/${evento.id}`, evento);
  }

  deleteEvento(id:number) : Observable<void> {
    return this.http.delete<void>(`${this.eventosUrl}/${id}`);
  }

  getTipoEventos(): Observable<TipoEvento[]> {
    return this.http.get<TipoEvento[]>(this.tiposEventosUrl);
  }

  getTipoEventoPorId(id:number): Observable<TipoEvento> {
    return this.http.get<TipoEvento>(`${this.tiposEventosUrl}/${id}`);
  }
}
