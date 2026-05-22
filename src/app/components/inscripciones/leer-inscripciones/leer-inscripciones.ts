import { Component, ElementRef, inject, Input, signal, ViewChild, AfterViewInit } from '@angular/core';
import { Inscripcion } from '../../../models/inscripcion.model';
import { ServInscripcionesJsonService } from '../../../services/serv-inscripciones-json.service';

declare const bootstrap: any;

@Component({
  selector: 'app-leer-inscripciones',
  standalone: true,
  templateUrl: './leer-inscripciones.html'
})
export class LeerInscripciones implements AfterViewInit {
  // Recibimos el ID del evento desde la pantalla principal
  @Input() eventoId!: number;
  
  // Signals para guardar la lista y saber si está cargando
  inscripciones = signal<Inscripcion[]>([]);
  cargando = signal<boolean>(false);

  @ViewChild('modalRef') modalElement!: ElementRef;
  private modalInstance: any;
  private servicioInscripciones = inject(ServInscripcionesJsonService);

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  abrirModal() {
    this.cargando.set(true); 
    this.modalInstance.show(); 

    this.servicioInscripciones.getInscripcionesByEventoId(this.eventoId).subscribe({
      next: (data) => {
        this.inscripciones.set(data);
        this.cargando.set(false); 
      },
      error: (err) => {
        console.error("Error al cargar los inscritos:", err);
        this.cargando.set(false);
      }
    });
  }

  cerrarModal() {
    this.modalInstance.hide();
  }
}