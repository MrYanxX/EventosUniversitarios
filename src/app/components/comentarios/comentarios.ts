import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { Comentario } from '../../models/comentario.model';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './comentarios.html',
  styleUrl: './comentarios.css'
})
export class ComentariosComponent implements OnInit {
  
  @Input() eventoId: string = '1'; 
  comentarioForm!: FormGroup;
  listaComentarios: Comentario[] = [];
  comentariosFiltrados: Comentario[] = [];
  
  // 💡 CORREGIDO: Ahora el ID en edición se maneja como string o null
  idComentarioEdicion: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  private inicializarFormulario(): void {
    this.comentarioForm = this.fb.group({
      estudiante: ['', [Validators.required, Validators.minLength(3)]],
      contenido: ['', [Validators.required, Validators.minLength(10)]],
      calificacion: ['', [Validators.required]],
      anonimo: [false]
    });
  }

  private cargarDatosIniciales(): void {
    this.http.get<Comentario[]>('http://localhost:3000/comentarios').subscribe({
      next: (datos) => {
        this.listaComentarios = datos || [];
        this.filtrarComentarios(); 
      },
      error: (err) => {
        console.error('Error cargando los comentarios de la API:', err);
      }
    });
  }

  filtrarComentarios(): void {
    this.comentariosFiltrados = this.listaComentarios.filter(comentario => {
      return String(comentario.eventoId) === String(this.eventoId);
    });
  }

  guardarComentario(): void {
    if (this.comentarioForm.invalid) {
      this.comentarioForm.markAllAsTouched();
      return;
    }

    const datosFormulario = this.comentarioForm.value;

    if (this.idComentarioEdicion !== null) {
      // ---> MODO ACTUALIZAR <---
      this.listaComentarios = this.listaComentarios.map(c => {
        if (String(c.id) === String(this.idComentarioEdicion)) {
          return { ...c, ...datosFormulario };
        }
        return c;
      });
      this.idComentarioEdicion = null;
    } else {
      // ---> MODO CREAR <---
      const nuevoComentario: Comentario = {
        id: this.listaComentarios.length > 0 ? String(Math.max(...this.listaComentarios.map(c => Number(c.id) || 0)) + 1) : '1',
        estudiante: datosFormulario.estudiante,
        contenido: datosFormulario.contenido,
        calificacion: Number(datosFormulario.calificacion),
        anonimo: datosFormulario.anonimo,
        eventoId: String(this.eventoId)
      };
      this.listaComentarios.push(nuevoComentario);
    }

    this.comentarioForm.reset({ anonimo: false, calificacion: '' });
    this.filtrarComentarios();
  }

  // 💡 CORREGIDO: Asignación de ID como string directo sin forzar a numérico
  seleccionarParaEditar(comentario: Comentario): void {
    this.idComentarioEdicion = comentario.id ? String(comentario.id) : null;
    this.comentarioForm.patchValue({
      estudiante: comentario.estudiante,
      contenido: comentario.contenido,
      calificacion: comentario.calificacion.toString(),
      anonimo: comentario.anonimo
    });
  }

  // 💡 CORREGIDO: El parámetro id ahora acepta string de forma segura
  eliminarComentario(id: string | number | undefined): void {
    if (!id) return;
    if (confirm('¿Está seguro de que desea eliminar este comentario?')) {
      this.listaComentarios = this.listaComentarios.filter(c => String(c.id) !== String(id));
      this.filtrarComentarios();
      
      if (String(this.idComentarioEdicion) === String(id)) {
        this.cancelarEdicion();
      }
    }
  }

  cancelarEdicion(): void {
    this.idComentarioEdicion = null;
    this.comentarioForm.reset({ anonimo: false, calificacion: '' });
  }
}
