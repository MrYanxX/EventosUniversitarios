import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Inscripcion } from '../models/inscripcion.model';

@Injectable({
  providedIn: 'root',
})
export class ServInscripcionesJsonService {

  //endpoints
  private inscripcionesUrl = 'http://127.0.0.1:3000/inscripciones';

  constructor(private http: HttpClient) {}

  //obtener una lista de inscripciones por ID
  getInscripcionesByEventoId(id:number): Observable<Inscripcion[]> {
    return this.http
    .get<Inscripcion[]>(this.inscripcionesUrl)
    .pipe(map((inscripcion) => inscripcion.filter((i) => i.eventoId == id)))
  };

  //post
  addInscripcion(inscripcion : Inscripcion) : Observable <Inscripcion> {
    return this.http.post<Inscripcion>(this.inscripcionesUrl, inscripcion);
  }

  //put
  updateInscripcion(inscripcion : Inscripcion) : Observable <Inscripcion> {
    return this.http.put<Inscripcion>(`${this.inscripcionesUrl}/${inscripcion.id}`, inscripcion);
  }

  //delete
  deleteInscripcion(id : number) : Observable<void> {
    return this.http.delete<void>(`${this.inscripcionesUrl}/${id}`);
  }

}
