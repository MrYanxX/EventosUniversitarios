import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServInscripcionesJsonService } from '../../../services/serv-inscripciones-json.service';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { Evento } from '../../../models/evento.model';
import { Inscripcion } from '../../../models/inscripcion.model';

@Component({
  selector: 'app-form-inscripcion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-inscripcion.html'
})
export class FormInscripcion implements OnInit {
  evento = signal<Evento | null>(null);
  inscripciones = signal<Inscripcion[]>([]);
  eventoId: number = 0;

  // Variables para controlar el estado del modal y la edición
  mostrarModal = signal(false);
  isSaving = signal(false);
  inscripcionEnEdicion = signal<Inscripcion | null>(null);

  // Campos del formulario
  inscripcionForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    cedula: new FormControl('', Validators.required),
    tipoAsistencia: new FormControl('', Validators.required),
    requiereCertificado: new FormControl(false)
  });

  private servicioInscripciones = inject(ServInscripcionesJsonService);
  private servicioEventos = inject(ServEventsJsonService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.eventoId = Number(this.route.snapshot.paramMap.get('id'));
    this.servicioEventos.getEventoPorId(this.eventoId).subscribe(data => this.evento.set(data));
    
    // Cargamos la lista inicial de inscritos
    this.cargarInscripciones();
  }

  cargarInscripciones() {
    this.servicioInscripciones.getInscripcionesByEventoId(this.eventoId).subscribe(data => {
      this.inscripciones.set(data);
    });
  }

  abrirModalNuevo() {
    this.inscripcionEnEdicion.set(null);
    this.inscripcionForm.reset({ requiereCertificado: false }); // Valores por defecto
    this.mostrarModal.set(true);
  }

  abrirModalEditar(inscripcion: Inscripcion) {
    this.inscripcionEnEdicion.set(inscripcion);
    this.inscripcionForm.patchValue({
      nombre: inscripcion.nombre,
      cedula: inscripcion.cedula,
      tipoAsistencia: inscripcion.tipoAsistencia,
      requiereCertificado: inscripcion.requiereCertificado
    });
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  guardarInscripcion() {
    if (this.inscripcionForm.invalid) {
      this.inscripcionForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formVal = this.inscripcionForm.value;

    const payload: Inscripcion = {
      eventoId: this.eventoId,
      nombre: formVal.nombre!,
      cedula: formVal.cedula!,
      tipoAsistencia: formVal.tipoAsistencia!,
      requiereCertificado: formVal.requiereCertificado ?? false
    };

    const edicion = this.inscripcionEnEdicion();

    // Verificamos si estamos creando o actualizando
    if (edicion && edicion.id) {
      payload.id = edicion.id;
      this.servicioInscripciones.updateInscripcion(payload).subscribe({
        next: () => {
          this.cargarInscripciones(); // Recarga la tabla
          this.cerrarModal();
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false)
      });
    } else {
      this.servicioInscripciones.addInscripcion(payload).subscribe({
        next: () => {
          this.cargarInscripciones(); // Recarga la tabla
          this.cerrarModal();
          this.isSaving.set(false);
        },
        error: () => this.isSaving.set(false)
      });
    }
  }

  eliminarInscripcion(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
      this.servicioInscripciones.deleteInscripcion(id).subscribe(() => {
        this.cargarInscripciones(); // Actualiza la vista tras borrar
      });
    }
  }
}