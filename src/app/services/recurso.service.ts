import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recurso } from '../models/recurso.model';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7205/api/Recursos';

  getRecursos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRecurso(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearRecurso(recurso: any): Observable<any> {
    return this.http.post(this.apiUrl, recurso);
  }

  actualizarRecurso(id: number, recurso: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, recurso);
  }

  eliminarRecurso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}