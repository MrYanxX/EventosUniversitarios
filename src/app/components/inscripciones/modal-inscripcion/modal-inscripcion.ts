import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Inscripcion } from '../../../models/inscripcion.model';

// Declaramos bootstrap para poder controlar el modal desde TypeScript
declare const bootstrap: any; 

@Component({
  selector: 'app-modal-inscripcion',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './modal-inscripcion.html',
  styleUrl: './modal-inscripcion.css'
})
export class ModalInscripcion implements AfterViewInit {
  @Input() eventoId?: number; 
  
  // Emitimos el objeto Inscripcion Y el índice (null = nuevo, número = edición)
  @Output() registroExitoso = new EventEmitter<{ data: Inscripcion, index: number | null }>();

  // Enganchamos el modal del HTML a TypeScript
  @ViewChild('modalInscritosRef') modalElement!: ElementRef;
  modalRef: any; 
  
  editingIndex: number | null = null; 

  formularioInscripcion = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cedula: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')])
  });

  ngAfterViewInit(): void {
    // Inicializamos el modal en memoria cuando la vista cargue
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  // --- FUNCIONES QUE EL PADRE LLAMARÁ CON @ViewChild ---
  openForNew() {
    this.editingIndex = null;
    this.formularioInscripcion.reset(); 
    this.modalRef.show(); 
  }

  openForEdit(inscrito: Inscripcion, index: number) {
    this.editingIndex = index; 
    this.formularioInscripcion.patchValue(inscrito); 
    this.modalRef.show(); 
  }

  // --- LÓGICA DE GUARDADO ---
  guardarInscripcion() {
    if (this.formularioInscripcion.valid) {
      const nuevoInscrito = {
        eventoId: this.eventoId ?? 0,
        nombre: this.formularioInscripcion.value.nombre || '', 
        cedula: this.formularioInscripcion.value.cedula || ''
      } as Inscripcion; 
      
      this.registroExitoso.emit({ 
        data: nuevoInscrito, 
        index: this.editingIndex 
      });
      
      this.modalRef.hide();
    } else {
      this.formularioInscripcion.markAllAsTouched();
    }
  }
}