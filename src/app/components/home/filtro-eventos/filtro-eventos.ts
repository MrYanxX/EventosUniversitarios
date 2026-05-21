import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipoEvento } from '../../../models/tipoEvento.model';

@Component({
  selector: 'app-filtro-eventos',
  imports: [],
  templateUrl: './filtro-eventos.html',
  styleUrl: './filtro-eventos.css',
})
export class FiltroEventos {
  //Recibe la lista de eventos para el ComboBox
  @Input() tipos: TipoEvento[] = [];

  //Envia una señal cuando se selecciona el id de un evento en específico
  @Output() filtroCamiado = new EventEmitter<number>();

  //Esta funcion es un evento que obtiene el valor del id del tipo que esta seleccionado en el comboBox y luego emite la señal
  onCambioSeleccionado(event: any) {
    const idEvento = Number(event.target.value);
    this.filtroCamiado.emit(idEvento);
  }
}
