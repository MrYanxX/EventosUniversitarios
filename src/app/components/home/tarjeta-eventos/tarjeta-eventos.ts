import { Component, Input } from '@angular/core';
import { Evento } from '../../../models/evento.model';

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
}
