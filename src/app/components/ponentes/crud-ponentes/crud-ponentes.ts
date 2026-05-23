import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Ponente } from '../../../models/ponente.model';
import { Alerta } from '../../globales/alerta/alerta';

@Component({
  selector: 'app-crud-ponentes',
  standalone: true,
  imports: [CommonModule, FormsModule, Alerta],
  templateUrl: './crud-ponentes.html',
  styleUrls: ['./crud-ponentes.css']
})
export class CrudPonentes implements OnInit {

  ponentes: Ponente[] = [];

  busqueda: string = '';

  mensaje = '';

  tipoMensaje = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.http.get<Ponente[]>('json/ponentes.json')
      .subscribe(data => {

        this.ponentes = data;

      });

  }

  get ponentesFiltrados() {

    return this.ponentes.filter(p =>
      p.nombre.toLowerCase()
        .includes(this.busqueda.toLowerCase())
    );

  }

  nuevoPonente: Ponente = {
    id: 0,
    nombre: '',
    especialidad: '',
    correo: '',
    telefono: '',
    institucion: '',
    biografia: ''
  };

  editando = false;

  guardarPonente() {

    if (this.editando) {

      const index = this.ponentes.findIndex(
        p => p.id === this.nuevoPonente.id
      );

      this.ponentes[index] = { ...this.nuevoPonente };

      this.editando = false;

      this.mensaje = 'Ponente actualizado correctamente';

      this.tipoMensaje = 'success';

    } else {

      this.nuevoPonente.id = Date.now();

      this.ponentes.push({ ...this.nuevoPonente });

      this.mensaje = 'Ponente guardado correctamente';

      this.tipoMensaje = 'success';
    }

    this.limpiarFormulario();
  }

  editarPonente(ponente: Ponente) {

    this.nuevoPonente = { ...ponente };

    this.editando = true;
  }

  eliminarPonente(id: number) {

    this.ponentes = this.ponentes.filter(
      p => p.id !== id
    );

    this.mensaje = 'Ponente eliminado';

    this.tipoMensaje = 'warning';
  }

  limpiarFormulario() {

    this.nuevoPonente = {
      id: 0,
      nombre: '',
      especialidad: '',
      correo: '',
      telefono: '',
      institucion: '',
      biografia: ''
    };

  }

}