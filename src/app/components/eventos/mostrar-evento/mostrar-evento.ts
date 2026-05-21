import { Component, inject, signal } from '@angular/core';
import { Evento } from '../../../models/evento.model';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { ActivatedRoute } from '@angular/router';
import { ComentariosComponent } from "../../comentarios/comentarios";

@Component({
  selector: 'app-mostrar-evento',
  imports: [ComentariosComponent],
  templateUrl: './mostrar-evento.html',
  styleUrl: './mostrar-evento.css',
})
export class MostrarEvento {
  //Signals vacíos
  evento = signal<Evento | null>(null);
  tipoEvento = signal<string>('Cargando tipo...');

  private servicoEventos = inject(ServEventsJsonService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    //Obtener el ID de entrada
    const id = Number(this.route.snapshot.paramMap.get('id') ?? '');

    //llama al servicio con el ID que recibio
    this.servicoEventos.getEventoPorId(id).subscribe((data) => {
      this.evento.set(data);

      this.servicoEventos.getTipoEventoPorId(data.tipoEventoId).subscribe((tipo) => {
        this.tipoEvento.set(tipo.nombre);
      });
    });
  }
}
