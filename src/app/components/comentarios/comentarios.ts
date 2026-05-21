import { Component, OnInit } from '@angular/core';
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
  
  // Estructuras principales del CRUD
  comentarioForm!: FormGroup;
  listaComentarios: Comentario[] = [];
  comentariosFiltrados: Comentario[] = [];
  
  // Control de estado del CRUD
  idComentarioEdicion: number | null = null;
  textoBusqueda: string = '';
  eventoIdSimulado: number = 1; //

  // Inyectamos HttpClient junto a FormBuilder en el constructor
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  // 1. CREAR / VALIDAR: Configuración del formulario reactivo (4 campos exigidos)
  private inicializarFormulario(): void {
    this.comentarioForm = this.fb.group({
      estudiante: ['', [Validators.required, Validators.minLength(3)]],
      contenido: ['', [Validators.required, Validators.minLength(10)]],
      calificacion: ['', [Validators.required]],
      anonimo: [false]
    });
  }

  // 2. LEER: Carga asíncrona leyendo tu archivo real de la carpeta public
  private cargarDatosIniciales(): void {
    // Angular expone la carpeta public directamente en la raíz de la URL del servidor local
    this.http.get<{ comentarios: Comentario[] }>('json/datos.json').subscribe({
      next: (respuesta) => {
        this.listaComentarios = respuesta.comentarios || [];
        this.filtrarComentarios(); // Filtramos una vez que los datos han sido descargados con éxito
      },
      error: (err) => {
        console.error('Error cargando el archivo datos.json:', err);
      }
    });
  }


  filtrarComentarios(): void {
  this.comentariosFiltrados = this.listaComentarios.filter(comentario => {

    
    const coincideBusqueda = 
      comentario.estudiante.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
      comentario.contenido.toLowerCase().includes(this.textoBusqueda.toLowerCase());
    
    return coincideBusqueda;
  });
}

  // 3. GUARDAR (Procesa tanto la CREACIÓN como la ACTUALIZACIÓN)
  guardarComentario(): void {
    if (this.comentarioForm.invalid) {
      this.comentarioForm.markAllAsTouched();
      return;
    }

    const datosFormulario = this.comentarioForm.value;

    if (this.idComentarioEdicion !== null) {
      // ---> MODO ACTUALIZAR <---
      this.listaComentarios = this.listaComentarios.map(c => {
        if (c.id === this.idComentarioEdicion) {
          return { ...c, ...datosFormulario };
        }
        return c;
      });
      this.idComentarioEdicion = null;
    } else {
      // ---> MODO CREAR <---
      const nuevoComentario: Comentario = {
        id: this.listaComentarios.length > 0 ? Math.max(...this.listaComentarios.map(c => c.id || 0)) + 1 : 1,
        estudiante: datosFormulario.estudiante,
        contenido: datosFormulario.contenido,
        calificacion: Number(datosFormulario.calificacion),
        anonimo: datosFormulario.anonimo,
        eventoId: this.eventoIdSimulado
      };
      this.listaComentarios.push(nuevoComentario);
    }

    this.comentarioForm.reset({ anonimo: false, calificacion: '' });
    this.filtrarComentarios();
  }

  // 4. ACTUALIZAR: Pasa los datos de la fila de la tabla de vuelta al formulario
  seleccionarParaEditar(comentario: Comentario): void {
    this.idComentarioEdicion = comentario.id || null;
    this.comentarioForm.patchValue({
      estudiante: comentario.estudiante,
      contenido: comentario.contenido,
      calificacion: comentario.calificacion.toString(),
      anonimo: comentario.anonimo
    });
  }

  // 5. ELIMINAR: Remueve el registro del arreglo global en memoria
  eliminarComentario(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Está seguro de que desea eliminar este comentario?')) {
      this.listaComentarios = this.listaComentarios.filter(c => c.id !== id);
      this.filtrarComentarios();
      
      if (this.idComentarioEdicion === id) {
        this.cancelarEdicion();
      }
    }
  }

  cancelarEdicion(): void {
    this.idComentarioEdicion = null;
    this.comentarioForm.reset({ anonimo: false, calificacion: '' });
  }
}
