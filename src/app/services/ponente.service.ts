import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ponente } from '../models/ponente.model';

@Injectable({
  providedIn: 'root'
})
export class PonenteService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7205/api/Ponentes';

  getPonentes(): Observable<Ponente[]> {
    return this.http.get<Ponente[]>(this.apiUrl);
  }

  crearPonente(ponente: Ponente): Observable<Ponente> {
    return this.http.post<Ponente>(this.apiUrl, ponente);
  }

  actualizarPonente(id: number, ponente: Ponente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, ponente);
  }

  eliminarPonente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}