import { Component, inject, signal, } from '@angular/core';
import { Evento } from '../../../models/evento.model';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mostrar-evento',
  imports: [],
  templateUrl: './mostrar-evento.html',
  styleUrl: './mostrar-evento.css',
})
export class MostrarEvento {

  evento = signal<Evento | null>(null); //Empieza vacío 

  private servicoEventos = inject(ServEventsJsonService);

  constructor(private route:ActivatedRoute) {}

}
