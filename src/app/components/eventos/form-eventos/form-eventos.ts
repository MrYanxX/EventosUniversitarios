import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ServEventsJsonService } from '../../../services/serv-events-json.service';
import { ServInscripcionesJsonService } from '../../../services/serv-inscripciones-json.service';
import { TipoEvento } from '../../../models/tipoEvento.model';
import { Evento } from '../../../models/evento.model';
import { Inscripcion } from '../../../models/inscripcion.model';
import { ModalInscripcion } from '../../inscripciones/modal-inscripcion/modal-inscripcion';
import { ModalAlerta } from '../../globales/modal-alerta/modal-alerta';

@Component({
  selector: 'app-form-eventos',
  standalone: true,
  imports: [ReactiveFormsModule, ModalInscripcion, ModalAlerta],
  templateUrl: './form-eventos.html',
  styleUrl: './form-eventos.css',
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
  inscritosTemporales = signal<Inscripcion[]>([]);
  inscritosEliminados = signal<number[]>([]);

  isSaving = signal(false);
  eventoEditandoId: number | null = null;

  redireccionarTrasModal: boolean = false;

  @ViewChild(ModalInscripcion) modalHijo!: ModalInscripcion;
  @ViewChild(ModalAlerta) modalAlerta!: ModalAlerta;

  private servicioEventos = inject(ServEventsJsonService);
  private servicioInscripciones = inject(ServInscripcionesJsonService);
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

    this.servicioInscripciones.getInscripcionesByEventoId(id).subscribe((inscritos) => {
      this.inscritosTemporales.set(inscritos);
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

  abrirModalNuevo() {
    this.modalHijo.openForNew();
  }

  abrirModalEditar(inscrito: Inscripcion, index: number) {
    this.modalHijo.openForEdit(inscrito, index);
  }

  procesarInscritoDesdeModal(evento: { data: Inscripcion; index: number | null }) {
    if (evento.index !== null) {
      this.inscritosTemporales.update((lista) => {
        const nuevaLista = [...lista];
        nuevaLista[evento.index!] = evento.data;
        return nuevaLista;
      });
    } else {
      this.inscritosTemporales.update((lista) => [...lista, evento.data]);
    }
  }

  eliminarInscritoTemporal(index: number) {
    const inscritoABorrar = this.inscritosTemporales()[index];
    if (inscritoABorrar.id) {
      this.inscritosEliminados.update((lista) => [...lista, inscritoABorrar.id!]);
    }
    this.inscritosTemporales.update((lista) => lista.filter((_, i) => i !== index));
  }

  publicarEvento() {
    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched();
      this.redireccionarTrasModal = false;
      this.modalAlerta.mostrar(
        'Atención',
        'Por favor, revisa los campos en rojo, incluyendo la imagen.',
        true,
      );
      return;
    }

    this.isSaving.set(true);
    const formVal = this.eventoForm.value;

    // Convertimos tipoEventoId explícitamente a Number
    const datosEvento: Evento = {
      titulo: formVal.titulo || '',
      tipoEventoId: Number(formVal.tipoEventoId),
      fecha: formVal.fecha || '',
      detalles: formVal.detalles || '',
      imagen: formVal.imagen || '',
      organizadorId: 1,
    };

    // Si estamos editando, asignamos el ID original. Si es nuevo, dejamos que el backend lo cree.
    if (this.eventoEditandoId) {
      datosEvento.id = this.eventoEditandoId;
    }

    const peticionEvento = this.eventoEditandoId
      ? this.servicioEventos.updateEvento(datosEvento)
      : this.servicioEventos.addEvento(datosEvento);

    peticionEvento.subscribe({
      next: (eventoGuardado) => {
        const idFinalEvento = eventoGuardado.id!;
        this.sincronizarInscritosBD(idFinalEvento);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.redireccionarTrasModal = false;
        this.modalAlerta.mostrar('Error', 'Hubo un problema al guardar el evento.', true);
      },
    });
  }

  private sincronizarInscritosBD(idEvento: any) {
    const peticiones: Observable<any>[] = [];

    this.inscritosTemporales().forEach((inscrito) => {
      const payload: Inscripcion = { ...inscrito, eventoId: idEvento };
      if (inscrito.id) {
        peticiones.push(this.servicioInscripciones.updateInscripcion(payload));
      } else {
        peticiones.push(this.servicioInscripciones.addInscripcion(payload));
      }
    });

    this.inscritosEliminados().forEach((idBorrado) => {
      peticiones.push(this.servicioInscripciones.deleteInscripcion(idBorrado));
    });

    this.redireccionarTrasModal = true;

    if (peticiones.length > 0) {
      forkJoin(peticiones).subscribe(() => {
        this.isSaving.set(false);
        this.modalAlerta.mostrar(
          '¡Éxito!',
          'El evento y sus inscritos se han guardado correctamente.',
        );
      });
    } else {
      this.isSaving.set(false);
      this.modalAlerta.mostrar(
        '¡Éxito!',
        'El evento se ha guardado correctamente (Sin inscritos).',
      );
    }
  }

  manejarCierreModalAlerta() {
    if (this.redireccionarTrasModal) {
      this.router.navigate(['/tabla-eventos']);
    }
  }
}
