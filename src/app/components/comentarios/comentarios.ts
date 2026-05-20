import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comentarios',
  standalone: true, // Asegúrate de que tenga esta línea si es Angular 14-16, en Angular 17+ ya viene por defecto
  imports: [
    CommonModule,         // Requerido para usar *ngIf y *ngFor en tu HTML
    FormsModule,          // Requerido para formularios básicos
    ReactiveFormsModule,  // Altamente recomendado para las validaciones del CRUD
    RouterModule          // Requerido para que funcionen los enlaces de redirección
  ],
  templateUrl: './comentarios.html',
  styleUrl: './comentarios.css',
})
export class ComentariosComponent { // Se acostumbra agregar el sufijo Component para evitar errores de importación
  // Aquí irá la lógica de tu CRUD más adelante
}
