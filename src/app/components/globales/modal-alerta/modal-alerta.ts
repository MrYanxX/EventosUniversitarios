import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-modal-alerta',
  standalone: true,
  templateUrl: './modal-alerta.html'
})
export class ModalAlerta {
  @ViewChild('alertaModalRef') modalElement!: ElementRef;
  modalRef: any;

  titulo: string = '';
  mensaje: string = '';
  esError: boolean = false; // Para cambiar el color a rojo si hay un error

  // Emitimos un evento cuando el usuario le da a "Aceptar" y se cierra
  @Output() cerrado = new EventEmitter<void>();

  ngAfterViewInit() {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  // Función pública para que otros componentes invoquen este modal
  mostrar(titulo: string, mensaje: string, esError: boolean = false) {
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.esError = esError;
    this.modalRef.show();
  }

  // Se ejecuta al darle "Aceptar"
  confirmar() {
    this.modalRef.hide();
    this.cerrado.emit(); // Le avisa al padre que se cerró
  }
}