import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion } from '../models/inscripcion.model';

@Injectable({
  providedIn: 'root'
})
export class ServInscripcionesJsonService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7124/api'; 

  getInscripcionesByEventoId(eventoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}/inscripciones/evento/${eventoId}`);
  }

  addInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    const { id, ...nuevaInscripcion } = inscripcion;
    return this.http.post<Inscripcion>(`${this.apiUrl}/inscripciones`, nuevaInscripcion);
  }

  updateInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http.put<Inscripcion>(`${this.apiUrl}/inscripciones/${inscripcion.id}`, inscripcion);
  }

  deleteInscripcion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/inscripciones/${id}`);
  }
}