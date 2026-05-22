import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = 'http://localhost:3000/comentarios';
  private http = inject(HttpClient); 

  obtenerComentarios(): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(this.apiUrl);
  }

  crearComentario(comentario: Omit<Comentario, 'id'>): Observable<Comentario> {
    return this.http.post<Comentario>(this.apiUrl, comentario);
  }


  actualizarComentario(id: string, comentario: Omit<Comentario, 'id'>): Observable<Comentario> {
    return this.http.put<Comentario>(`${this.apiUrl}/${id}`, comentario);
  }

  eliminarComentario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
