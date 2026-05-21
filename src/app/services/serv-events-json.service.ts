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

  getTipoEventos(): Observable<TipoEvento[]> {
    return this.http.get<TipoEvento[]>(this.tiposEventosUrl);
  }

  getEventoPorId(id:string): Observable<Evento> {
    return this.http.get<Evento>(`${this.eventosUrl}/${id}`);
  }
}
