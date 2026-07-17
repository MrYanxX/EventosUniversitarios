import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecursoService } from '../../../services/recurso.service';

import { Recurso } from '../../../models/recurso.model';
import { Alerta } from '../../globales/alerta/alerta';

@Component({
  selector: 'app-crud-recursos',
  standalone: true,
  imports: [CommonModule, FormsModule, Alerta],
  templateUrl: './crud-recursos.html',
  styleUrls: ['./crud-recursos.css']
})
export class CrudRecursos implements OnInit {

  recursos: Recurso[] = [];

  busqueda: string = '';

  mensaje = '';

  tipoMensaje = '';

  constructor(private recursoService: RecursoService) { }

  ngOnInit(): void {

    this.recursoService.getRecursos().subscribe(data => {
      this.recursos = data;
    });

  }

  get recursosFiltrados() {

    return this.recursos.filter(r =>
      r.nombre.toLowerCase()
        .includes(this.busqueda.toLowerCase())
    );

  }

  nuevoRecurso: Recurso = {
    id: 0,
    nombre: '',
    tipo: '',
    cantidad: 0,
    disponible: false,
    descripcion: ''
  };

  editando = false;

  guardarRecurso() {

    if (this.editando) {

      this.recursoService.actualizarRecurso(this.nuevoRecurso.id, this.nuevoRecurso)
        .subscribe({
          next: () => {

            this.mensaje = 'Recurso actualizado correctamente';
            this.tipoMensaje = 'success';

            this.recursoService.getRecursos().subscribe(data => {
              this.recursos = data;
            });

            this.editando = false;
            this.limpiarFormulario();

          },
          error: (err) => {
            console.error(err);
          }
        });

    } else {

      this.recursoService.crearRecurso(this.nuevoRecurso)
        .subscribe({
          next: () => {

            this.mensaje = 'Recurso guardado correctamente';
            this.tipoMensaje = 'success';

            this.recursoService.getRecursos().subscribe(data => {
              this.recursos = data;
            });

            this.limpiarFormulario();

          },
          error: (err) => {
            console.error(err);
          }
        });

    }

  }

  editarRecurso(recurso: Recurso) {

    this.nuevoRecurso = { ...recurso };

    this.editando = true;
  }

  eliminarRecurso(id: number) {

    this.recursoService.eliminarRecurso(id)
      .subscribe({
        next: () => {

          this.mensaje = 'Recurso eliminado';
          this.tipoMensaje = 'warning';

          this.recursoService.getRecursos().subscribe(data => {
            this.recursos = data;
          });

        },
        error: (err) => {
          console.error(err);
        }
      });

  }

  limpiarFormulario() {

    this.nuevoRecurso = {
      id: 0,
      nombre: '',
      tipo: '',
      cantidad: 0,
      disponible: false,
      descripcion: ''
    };

  }

}


