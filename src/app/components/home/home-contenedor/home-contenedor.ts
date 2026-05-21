import { Component, computed, inject, signal } from '@angular/core';
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
  imports: [FiltroEventos, TarjetaEventos, BarraBusqueda, ComentariosComponent],
  templateUrl: './home-contenedor.html',
  styleUrl: './home-contenedor.css',
})
export class HomeContenedor {
  titulo = 'Eventos';

  //Signals para guardar los objetos obtenidos
  eventosIniciales = signal<Evento[]>([]);
  tiposEventos = signal<TipoEvento[]>([]);
  idFiltroSeleccionado = signal<number>(0);

  eventosFiltrados = computed(() => {
    const todosLosEventos = this.eventosIniciales();
    const filtroId = this.idFiltroSeleccionado();

    //En caso de que el ID sea 0 retorna la lista estatica de Eventos que se tenía inicialmente
    if (filtroId == 0) {
      return todosLosEventos;
    }

    //Filtra con la función filter los eventos que coinciden con el ID
    return todosLosEventos.filter((evento) => evento.tipoEventoId === filtroId);
  });

  private servicioEventos = inject(ServEventsJsonService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    //Solicita al servicio los tipos de eventos y se suscribe para detectar cambios
    this.servicioEventos.getTipoEventos().subscribe((data) => {
      this.tiposEventos.set(data);
    });

    //Solicita al servicio los eventos y se suscribe
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
}
