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

  // Lista para recordar a quién borramos y poder borrarlo de la BD al final
  inscritosEliminados = signal<number[]>([]);

  isSaving = signal(false);
  eventoEditandoId: number | null = null; // Saber si es nuevo o edición

  @ViewChild(ModalInscripcion) modalHijo!: ModalInscripcion;
  @ViewChild(ModalAlerta) modalAlerta!: ModalAlerta; // Control del modal de alertas

  private servicioEventos = inject(ServEventsJsonService);
  private servicioInscripciones = inject(ServInscripcionesJsonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Para leer el ID de la URL

  ngOnInit() {
    // 1. Cargar tipos de evento
    this.servicioEventos.getTipoEventos().subscribe((data) => this.tiposEvento.set(data));

    // 2. Revisar si la URL trajo un ID (Ej: /editar-evento/5)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventoEditandoId = Number(idParam);
      this.cargarEventoParaEdicion(this.eventoEditandoId);
    }
  }

  // --- LÓGICA DE MODO EDICIÓN ---
  cargarEventoParaEdicion(id: number) {
    // A. Buscar el evento y llenar el form
    this.servicioEventos.getEventoPorId(id).subscribe((evento) => {
      this.eventoForm.patchValue({
        ...evento,
        tipoEventoId: String(evento.tipoEventoId),
      });
    });

    // B. Buscar sus inscritos (Deberás crear este método en tu servicio de inscripciones)
    this.servicioInscripciones.getInscripcionesByEventoId(id).subscribe((inscritos) => {
      this.inscritosTemporales.set(inscritos);
    });
  }

  // --- LÓGICA DE LA IMAGEN ---
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

  // --- CONTROL DEL MODAL DE INSCRITOS ---
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

    // Si ya tenía un ID de base de datos, lo guardamos en la lista negra para eliminarlo al publicar
    if (inscritoABorrar.id) {
      this.inscritosEliminados.update((lista) => [...lista, inscritoABorrar.id!]);
    }

    this.inscritosTemporales.update((lista) => lista.filter((_, i) => i !== index));
  }

  // --- GUARDADO FINAL ---
  publicarEvento() {
    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched();
      this.modalAlerta.mostrar(
        'Atención',
        'Por favor, llena todos los campos del evento, incluyendo la imagen.',
        true,
      );
      return;
    }

    this.isSaving.set(true);

    // Armamos el evento extrayendo los valores uno por uno para asegurar los tipos
    const formVal = this.eventoForm.value;

    const datosEvento: Evento = {
      titulo: formVal.titulo || '',
      tipoEventoId: Number(formVal.tipoEventoId), // ¡Lo convertimos a número!
      fecha: formVal.fecha || '',
      detalles: formVal.detalles || '',
      imagen: formVal.imagen || '',
      organizadorId: 1, // Tu compañero se encargará de esto después
      id: this.eventoEditandoId || undefined, // Solo lo enviamos si existe
    };

    // Si tenemos ID actualizamos (PUT), si no, creamos (POST)
    const peticionEvento = this.eventoEditandoId
      ? this.servicioEventos.updateEvento(datosEvento)
      : this.servicioEventos.addEvento(datosEvento);

    // ... (el resto del subscribe se queda igualito)
    peticionEvento.subscribe({
      next: (eventoGuardado) => {
        const idFinalEvento = eventoGuardado.id!;
        this.sincronizarInscritosBD(idFinalEvento);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.modalAlerta.mostrar('Error', 'Hubo un problema al guardar el evento.', true);
      },
    });
  }

  private sincronizarInscritosBD(idEvento: number) {
    const peticiones: Observable<any>[] = [];

    // 1. Nuevos o actualizados
    this.inscritosTemporales().forEach((inscrito) => {
      const payload: Inscripcion = { ...inscrito, eventoId: idEvento };
      if (inscrito.id) {
        // Ya existía: Hacemos PUT
        peticiones.push(this.servicioInscripciones.updateInscripcion(payload));
      } else {
        // Es nuevo: Hacemos POST
        peticiones.push(this.servicioInscripciones.addInscripcion(payload));
      }
    });

    // 2. Eliminados: Hacemos DELETE
    this.inscritosEliminados().forEach((idBorrado) => {
      peticiones.push(this.servicioInscripciones.deleteInscripcion(idBorrado));
    });

    if (peticiones.length > 0) {
      forkJoin(peticiones).subscribe(() => {
        this.isSaving.set(false);
        // Usamos nuestro nuevo modal de alerta!
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

  // Esta función es llamada por el @Output del ModalAlerta cuando el usuario le da a "Aceptar"
  volverAlHome() {
    this.router.navigate(['/home']); // O la ruta de tu tabla
  }
}
