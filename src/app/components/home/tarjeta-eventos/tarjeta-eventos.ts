import { Component, Input } from '@angular/core';
import { Evento } from '../../../models/evento.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-eventos',
  imports: [],
  templateUrl: './tarjeta-eventos.html',
  styleUrl: './tarjeta-eventos.css',
})
export class TarjetaEventos {
  //Espera a recibir un objeto
  @Input({required: true}) evento!: Evento;

  //Recibe el string del nombre por inyección del home
  @Input() nombreTipo:string = '';

  constructor( private router:Router ) {  }

  verDetallesEvento(id: number | undefined) {
    //Ruteo interno
    this.router.navigate(["/evento", id]);
  }
}
