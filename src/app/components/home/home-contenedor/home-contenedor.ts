import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FiltroEventos } from '../filtro-eventos/filtro-eventos';
import { BarraBusqueda } from '../barra-busqueda/barra-busqueda';
import { TarjetaEventos } from '../tarjeta-eventos/tarjeta-eventos';
import { Evento } from '../../../models/evento.model';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { Router } from '@angular/router';
import { TipoEvento } from '../../../models/tipoEvento.model';

@Component({
  selector: 'app-home-contenedor',
  imports: [CommonModule, FiltroEventos, TarjetaEventos, BarraBusqueda],
  templateUrl: './home-contenedor.html',
  styleUrl: './home-contenedor.css',
})
export class HomeContenedor {
  titulo = 'Eventos';

  // Signals para guardar los objetos obtenidos
  eventosIniciales = signal<Evento[]>([]);
  terminoBusqueda = signal<string>(''); 
  tiposEventos = signal<TipoEvento[]>([]);
  idFiltroSeleccionado = signal<number>(0);

  // Controla el ID del evento abierto 
  eventoAbiertoId = signal<string | null>(null);

  // Computed con doble filtro
  eventosFiltrados = computed(() => {
    const todosLosEventos = this.eventosIniciales();
    const filtroId = this.idFiltroSeleccionado();
    const textoBuscado = this.terminoBusqueda().toLowerCase();

    return todosLosEventos.filter((evento) => {
      // Condición del Combobox (Si es 0, cuenta como válido para todos. Si no, debe coincidir el ID)
      // Usamos Number() por si el select de HTML devuelve un string
      const coincideTipo = filtroId == 0 || evento.tipoEventoId === filtroId;

      // Condición del Buscador 
      const coincideTexto = evento.titulo.toLowerCase().includes(textoBuscado);

      return coincideTipo && coincideTexto;
    });
  });

  private servicioEventos = inject(ServEventsJsonService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.servicioEventos.getTipoEventos().subscribe((data) => {
      this.tiposEventos.set(data);
    });

    this.servicioEventos.getEventos().subscribe((data) => {
      this.eventosIniciales.set(data);
    });
  }

  obtenerNombreDelTipoDeEvento(idBuscado: number | string): string {
    const tipoEncontrado = this.tiposEventos().find((tipo) => tipo.id == idBuscado);
    return tipoEncontrado ? tipoEncontrado.nombre : 'Desconocido';
  }

  // Se ejecuta cuando cambia el combobox
  aplicarFiltro(tipoId: number) {
    this.idFiltroSeleccionado.set(tipoId);
  }

  // Se ejecuta cuando el usuario escribe en la barra de búsqueda
  recibirBusqueda(texto: string) {
    this.terminoBusqueda.set(texto);
  }
}