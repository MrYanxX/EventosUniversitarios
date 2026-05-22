import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-barra-busqueda',
  standalone: true,
  templateUrl: './barra-busqueda.html'
})
export class BarraBusqueda {
  // Outuput para avisarle al Padre
  @Output() busqueda = new EventEmitter<string>();

  // Se ejecuta cada vez que el usuario presiona una tecla
  onTerminoCambiado(evento: any) {
    const terminoEscrito = evento.target.value;
    // Disparamos el evento hacia arriba
    this.busqueda.emit(terminoEscrito);
  }
}