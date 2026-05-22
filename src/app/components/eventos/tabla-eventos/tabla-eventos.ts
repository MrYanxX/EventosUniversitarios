import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { Evento } from '../../../models/evento.model';

@Component({
  selector: 'app-tabla-eventos',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './tabla-eventos.html'
})
export class TablaEventos implements OnInit {
  eventos = signal<Evento[]>([]);
  
  private servicioEventos = inject(ServEventsJsonService);

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.servicioEventos.getEventos().subscribe(data => this.eventos.set(data));
  }

  eliminarEvento(evento: Evento) {
    if (confirm(`¿Estás seguro de eliminar "${evento.titulo}"?`)) {
      this.servicioEventos.deleteEvento(evento.id!).subscribe(() => {
        this.eventos.update(lista => lista.filter(e => e.id !== evento.id));
      });
    }
  }
}