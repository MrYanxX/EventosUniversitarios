import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Comentario } from '../../models/comentario.model';
import { ComentarioService } from '../../services/comentario.service'; 

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
  idComentarioEdicion: string | null = null;

  private fb = inject(FormBuilder);
  private comentarioService = inject(ComentarioService);
  ngOnInit(): void {
    this.inicializarFormulario();
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
    this.comentarioService.obtenerComentarios().subscribe({
      next: (datos) => {
        this.listaComentarios = datos || [];
        this.filtrarComentarios(); 
      },
      error: (err) => console.error('Error al obtener comentarios:', err)
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
    const comentarioData = {
      estudiante: datosFormulario.estudiante,
      contenido: datosFormulario.contenido,
      calificacion: Number(datosFormulario.calificacion),
      anonimo: datosFormulario.anonimo,
      eventoId: String(this.eventoId)
    };

    if (this.idComentarioEdicion !== null) {
      
      this.comentarioService.actualizarComentario(this.idComentarioEdicion, comentarioData).subscribe({
        next: () => {
          this.idComentarioEdicion = null;
          this.comentarioForm.reset({ anonimo: false, calificacion: '' });
          this.cargarDatosIniciales(); // Recarga la lista desde la API real
        }
      });
    } else {
     
      this.comentarioService.crearComentario(comentarioData).subscribe({
        next: () => {
          this.comentarioForm.reset({ anonimo: false, calificacion: '' });
          this.cargarDatosIniciales();
        }
      });
    }
  }

  seleccionarParaEditar(comentario: Comentario): void {
    this.idComentarioEdicion = comentario.id ? String(comentario.id) : null;
    this.comentarioForm.patchValue({
      estudiante: comentario.estudiante,
      contenido: comentario.contenido,
      calificacion: comentario.calificacion.toString(),
      anonimo: comentario.anonimo
    });
  }

  eliminarComentario(id: string | number | undefined): void {
    if (!id) return;
    if (confirm('¿Está seguro de que desea eliminar este comentario?')) {

      this.comentarioService.eliminarComentario(String(id)).subscribe({
        next: () => {
          this.cargarDatosIniciales();
          if (String(this.idComentarioEdicion) === String(id)) {
            this.cancelarEdicion();
          }
        },
        error: (err) => console.error('Error al eliminar comentario:', err)
      });
    }
  }

  cancelarEdicion(): void {
    this.idComentarioEdicion = null;
    this.comentarioForm.reset({ anonimo: false, calificacion: '' });
  }
}
