import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { Evento } from '../../../models/evento.model';

@Component({
  selector: 'app-lista-inscripciones',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista-inscripciones.html'
})
export class ListaInscripciones implements OnInit {
  eventos = signal<Evento[]>([]);
  terminoBusqueda = signal<string>('');

  // Computed signal que reacciona automáticamente al texto de búsqueda
  eventosFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase();
    return this.eventos().filter(e => e.titulo.toLowerCase().includes(termino));
  });

  private servicioEventos = inject(ServEventsJsonService);

  ngOnInit() {
    this.servicioEventos.getEventos().subscribe(data => this.eventos.set(data));
  }

  actualizarBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;
    this.terminoBusqueda.set(input.value);
  }
}