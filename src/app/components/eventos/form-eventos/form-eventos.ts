import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { TipoEvento } from '../../../models/tipoEvento.model';
import { Evento } from '../../../models/evento.model';
import { ModalAlerta } from '../../globales/modal-alerta/modal-alerta';

@Component({
  selector: 'app-form-eventos',
  standalone: true,
  imports: [ReactiveFormsModule, ModalAlerta, RouterLink],
  templateUrl: './form-eventos.html',
})
export class FormEventos implements OnInit {
  eventoForm = new FormGroup({
    titulo: new FormControl('', Validators.required),
    tipoEventoId: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    detalles: new FormControl('', Validators.required),
    imagen: new FormControl('', Validators.required),
  });

  tiposEvento = signal<TipoEvento[]>([]);
  isSaving = signal(false);
  eventoEditandoId: number | null = null; 
  redireccionarTrasModal: boolean = false; 

  @ViewChild(ModalAlerta) modalAlerta!: ModalAlerta; 

  private servicioEventos = inject(ServEventsJsonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 

  ngOnInit() {
    this.servicioEventos.getTipoEventos().subscribe((data) => this.tiposEvento.set(data));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventoEditandoId = Number(idParam);
      this.cargarEventoParaEdicion(this.eventoEditandoId);
    }
  }

  cargarEventoParaEdicion(id: number) {
    this.servicioEventos.getEventoPorId(id).subscribe((evento) => {
      this.eventoForm.patchValue({
        ...evento,
        tipoEventoId: String(evento.tipoEventoId),
      });
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.eventoForm.patchValue({ imagen: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  publicarEvento() {
    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched();
      this.redireccionarTrasModal = false; 
      this.modalAlerta.mostrar('Atención', 'Revisa los campos en rojo, incluyendo la imagen.', true);
      return;
    }

    this.isSaving.set(true);
    const formVal = this.eventoForm.value;

    const datosEvento: Evento = {
      titulo: formVal.titulo || '',
      tipoEventoId: Number(formVal.tipoEventoId),
      fecha: formVal.fecha || '',
      detalles: formVal.detalles || '',
      imagen: formVal.imagen || '',
      organizadorId: 1, 
    };

    if (this.eventoEditandoId) {
      datosEvento.id = this.eventoEditandoId;
    }

    const peticion = this.eventoEditandoId
      ? this.servicioEventos.updateEvento(datosEvento)
      : this.servicioEventos.addEvento(datosEvento);

    peticion.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.redireccionarTrasModal = true;
        this.modalAlerta.mostrar('¡Éxito!', 'El evento se ha guardado correctamente.');
      },
      error: () => {
        this.isSaving.set(false);
        this.modalAlerta.mostrar('Error', 'Hubo un problema al guardar el evento.', true);
      },
    });
  }

  manejarCierreModalAlerta() {
    if (this.redireccionarTrasModal) {
      this.router.navigate(['/tabla-eventos']); 
    }
  }
}