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
  @Input({required: true}) evento!: Evento;
  @Input() nombreTipo:string = '';

  constructor( private router:Router ) {  }

  verDetallesEvento(id: string | number | undefined) {
    this.router.navigate(["/evento", id]);
  }
}