import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { StudentUser } from '../../../../models/usuarios';

@Component({
  selector: 'app-dashboard-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './dashboard-estudiantes.html',
  styleUrls: ['./dashboard-estudiantes.css']
})
export class DashboardEstudiantesComponent implements OnInit {
  usuarioActual: StudentUser | null = null;
  
  // Variables para el CRUD
  listaEstudiantes: StudentUser[] = [];
  estudianteEnEdicion: StudentUser | null = null;
  mensajeCrud = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    
    if (!user || user.tipo !== 'estudiante') {
      this.router.navigate(['/cuenta']);
      return;
    }
    
    this.usuarioActual = user as StudentUser;
    this.cargarEstudiantes();
  }

  // Cargar lista desde la BD
  cargarEstudiantes(): void {
    this.authService.getEstudiantes().subscribe({
      next: (data) => {
        // Mapeamos para asegurarnos de que mantengan la propiedad tipo
        this.listaEstudiantes = data.map(e => ({ ...e, tipo: 'estudiante' }));
      },
      error: (err) => console.error('Error al cargar estudiantes', err)
    });
  }

  // Iniciar edición
  editarEstudiante(estudiante: StudentUser): void {
    // Clonamos el objeto para no modificar la tabla hasta guardar
    this.estudianteEnEdicion = { ...estudiante };
    this.mensajeCrud = '';
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.estudianteEnEdicion = null;
    this.mensajeCrud = '';
  }

  // Guardar cambios en la BD
  guardarCambios(): void {
    if (!this.estudianteEnEdicion || !this.estudianteEnEdicion.id) return;

    this.authService.actualizarEstudiante(this.estudianteEnEdicion.id, this.estudianteEnEdicion)
      .subscribe({
        next: () => {
          this.mensajeCrud = 'Estudiante actualizado correctamente.';
          this.cargarEstudiantes(); // Recargar tabla
          this.estudianteEnEdicion = null; // Cerrar formulario de edición
        },
        error: (err) => {
          console.error(err);
          this.mensajeCrud = 'Error al actualizar el estudiante.';
        }
      });
  }

  // Eliminar de la BD
  eliminarEstudiante(id?: number): void {
    if (!id) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.')) {
      this.authService.eliminarEstudiante(id).subscribe({
        next: () => {
          this.mensajeCrud = 'Estudiante eliminado.';
          
          // Si el usuario se eliminó a sí mismo, cerramos sesión
          if (this.usuarioActual?.id === id) {
            this.logout();
            return;
          }
          
          this.cargarEstudiantes();
        },
        error: (err) => {
          console.error(err);
          this.mensajeCrud = 'Error al eliminar el estudiante.';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}