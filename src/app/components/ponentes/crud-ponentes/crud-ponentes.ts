import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PonenteService } from '../../../services/ponente.service';

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

  constructor(private ponenteService: PonenteService) { }

  ngOnInit(): void {

    this.ponenteService.getPonentes().subscribe(data => {
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

      this.ponenteService.actualizarPonente(this.nuevoPonente.id!, this.nuevoPonente)
        .subscribe({
          next: () => {
            this.mensaje = 'Ponente actualizado correctamente';
            this.tipoMensaje = 'success';

            this.ponenteService.getPonentes().subscribe(data => {
              this.ponentes = data;
            });

            this.editando = false;
            this.limpiarFormulario();
          },
          error: (err) => {
            console.log('ERROR COMPLETO:', err);
            console.log('RESPUESTA:', err.error);
            console.log('ERRORES:', err.error.errors);

            alert(JSON.stringify(err.error.errors, null, 2));

            this.mensaje = 'Error al guardar el ponente';
            this.tipoMensaje = 'danger';
          }
        });

    } else {

      this.ponenteService.crearPonente(this.nuevoPonente)
        .subscribe({
          next: () => {
            this.mensaje = 'Ponente guardado correctamente';
            this.tipoMensaje = 'success';

            this.ponenteService.getPonentes().subscribe(data => {
              this.ponentes = data;
            });

            this.limpiarFormulario();
          },
          error: (err) => {
            console.error(err);
            this.mensaje = 'Error al guardar el ponente';
            this.tipoMensaje = 'danger';
          }
        });

    }
  }

  eliminarPonente(id: number) {

    this.ponenteService.eliminarPonente(id).subscribe({
      next: () => {

        this.mensaje = 'Ponente eliminado';
        this.tipoMensaje = 'warning';

        this.ponenteService.getPonentes().subscribe(data => {
          this.ponentes = data;
        });

      },
      error: (err) => {
        console.error(err);
      }
    });

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

  editarPonente(ponente: Ponente) {

    this.nuevoPonente = { ...ponente };

    this.editando = true;

  }

}
