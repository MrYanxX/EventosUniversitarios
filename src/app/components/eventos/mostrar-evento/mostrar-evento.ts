import { Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { Evento } from '../../../models/evento.model';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { ActivatedRoute } from '@angular/router';
import { ComentariosComponent } from '../../comentarios/comentarios';
import { LeerInscripciones } from '../../inscripciones/leer-inscripciones/leer-inscripciones';

@Component({
  selector: 'app-mostrar-evento',
  standalone: true,
  imports: [ComentariosComponent, LeerInscripciones],
  templateUrl: './mostrar-evento.html',
  styleUrl: './mostrar-evento.css',
})
export class MostrarEvento implements OnInit {
  evento = signal<Evento | null>(null);
  tipoEvento = signal<string>('Cargando tipo...');

  @ViewChild(LeerInscripciones) modalInscripciones!: LeerInscripciones;

  private servicoEventos = inject(ServEventsJsonService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    const idFinal = Number(paramId ?? 0); // Conversión limpia y segura a number

    this.servicoEventos.getEventoPorId(idFinal).subscribe((data) => {
      this.evento.set(data);

      this.servicoEventos.getTipoEventoPorId(Number(data.tipoEventoId)).subscribe((tipo) => {
        this.tipoEvento.set(tipo.nombre);
      });
    });
  }

  abrirListaInscritos() {
    this.modalInscripciones.abrirModal();
  }
}
