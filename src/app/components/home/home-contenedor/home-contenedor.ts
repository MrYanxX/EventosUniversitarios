import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // 💡 Importante si el HTML requiere directivas comunes
import { FiltroEventos } from '../filtro-eventos/filtro-eventos';
import { BarraBusqueda } from '../barra-busqueda/barra-busqueda';
import { TarjetaEventos } from '../tarjeta-eventos/tarjeta-eventos';
import { Evento } from '../../../models/evento.model';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { Router } from '@angular/router';
import { TipoEvento } from '../../../models/tipoEvento.model';
import { ComentariosComponent } from "../../comentarios/comentarios";

@Component({
  selector: 'app-home-contenedor',
  // 💡 Añadimos CommonModule por seguridad para el control de flujo
  imports: [CommonModule, FiltroEventos, TarjetaEventos, BarraBusqueda, ComentariosComponent],
  templateUrl: './home-contenedor.html',
  styleUrl: './home-contenedor.css',
})
export class HomeContenedor {
  titulo = 'Eventos';

  // Signals para guardar los objetos obtenidos
  eventosIniciales = signal<Evento[]>([]);
  tiposEventos = signal<TipoEvento[]>([]);
  idFiltroSeleccionado = signal<number>(0);

  // 💡 TU NUEVA SIGNAL: Controla el ID del evento abierto (inicia vacío)
  eventoAbiertoId = signal<string | null>(null);

  eventosFiltrados = computed(() => {
    const todosLosEventos = this.eventosIniciales();
    const filtroId = this.idFiltroSeleccionado();

    if (filtroId == 0) {
      return todosLosEventos;
    }

    return todosLosEventos.filter((evento) => evento.tipoEventoId === filtroId);
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

  obtenerNombreDelTipoDeEvento(idBuscado: number): string {
    const tipoEncontrado = this.tiposEventos().find((tipo) => tipo.id == idBuscado);
    return tipoEncontrado ? tipoEncontrado.nombre : 'Desconocido';
  }

  aplicarFiltro(tipoId: number) {
    this.idFiltroSeleccionado.set(tipoId);
  }

  // 💡 TUS NUEVOS MÉTODOS REACTIVOS PARA LOS COMENTARIOS:
  // Como los eventos usan IDs tipo string o número, forzamos la conversión a String segura
  abrirComentarios(id: string | number | undefined): void {
    if (!id) return;
    this.eventoAbiertoId.set(String(id));
  }

  cerrarComentarios(): void {
    this.eventoAbiertoId.set(null);
  }
}
