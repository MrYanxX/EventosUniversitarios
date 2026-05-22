import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { Evento } from '../../../models/evento.model';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { ActivatedRoute } from '@angular/router';
import { ComentariosComponent } from "../../comentarios/comentarios";

// 1. Importamos el nuevo modal
import { LeerInscripciones } from '../../inscripciones/leer-inscripciones/leer-inscripciones';

@Component({
  selector: 'app-mostrar-evento',
  standalone: true,
  imports: [ComentariosComponent, LeerInscripciones], // 2. Lo agregamos aquí
  templateUrl: './mostrar-evento.html',
  styleUrl: './mostrar-evento.css',
})
export class MostrarEvento implements OnInit {
    protected readonly String = String;
  evento = signal<Evento | null>(null);
  tipoEvento = signal<string>('Cargando tipo...');

  // 3. Obtenemos el control remoto del modal
  @ViewChild(LeerInscripciones) modalInscripciones!: LeerInscripciones;

  private servicoEventos = inject(ServEventsJsonService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id') ?? '');

    this.servicoEventos.getEventoPorId(id).subscribe((data) => {
      this.evento.set(data);

      this.servicoEventos.getTipoEventoPorId(data.tipoEventoId).subscribe((tipo) => {
        this.tipoEvento.set(tipo.nombre);
      });
    });
  }

  // 4. Creamos la función que abrirá el modal al dar clic en el botón
  abrirListaInscritos() {
    this.modalInscripciones.abrirModal();
  }
}