import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.http.get<Recurso[]>('json/recursos.json')
      .subscribe(data => {

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

      const index = this.recursos.findIndex(
        r => r.id === this.nuevoRecurso.id
      );

      this.recursos[index] = { ...this.nuevoRecurso };

      this.editando = false;

      this.mensaje = 'Recurso actualizado correctamente';

      this.tipoMensaje = 'success';

    } else {

      this.nuevoRecurso.id = Date.now();

      this.recursos.push({ ...this.nuevoRecurso });

      this.mensaje = 'Recurso guardado correctamente';

      this.tipoMensaje = 'success';
    }

    this.limpiarFormulario();
  }

  editarRecurso(recurso: Recurso) {

    this.nuevoRecurso = { ...recurso };

    this.editando = true;
  }

  eliminarRecurso(id: number) {

    this.recursos = this.recursos.filter(
      r => r.id !== id
    );

    this.mensaje = 'Recurso eliminado';

    this.tipoMensaje = 'warning';
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