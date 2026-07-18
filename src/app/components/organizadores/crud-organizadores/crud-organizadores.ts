import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Organizador } from '../../../models/organizador.model';
import { OrganizadorService } from '../../../services/organizador.service';
import { Alerta } from '../../globales/alerta/alerta';

@Component({
  selector: 'app-crud-organizadores',
  standalone: true,
  imports: [CommonModule, FormsModule, Alerta],
  templateUrl: './crud-organizadores.html',
  styleUrls: ['./crud-organizadores.css']
})
export class CrudOrganizadores implements OnInit {
  busqueda = '';
  mensaje = '';
  tipoMensaje = '';
  editando = false;
  mostrarPassword = false;
  cargando = false;

  nuevoOrg: Organizador = this.orgVacio();

  constructor(public orgService: OrganizadorService) {}

  ngOnInit(): void {
    this.cargarLista();
  }

  private cargarLista(): void {
    this.cargando = true;
    this.orgService.cargar().subscribe({
      next: () => (this.cargando = false),
      error: (err: HttpErrorResponse) => {
        this.cargando = false;
        this.mostrarAlerta(this.textoError(err, 'No se pudo cargar la lista de organizadores.'), 'danger');
      }
    });
  }

  get organizadoresFiltrados(): Organizador[] {
    const q = this.busqueda.toLowerCase();
    return this.orgService.getAll().filter(
      o =>
        o.nombre.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.facultad.toLowerCase().includes(q)
    );
  }

  guardar(form: { invalid: boolean | null }): void {
    if (form.invalid) return;

    if (this.editando) {
      this.orgService.actualizar(this.nuevoOrg).subscribe({
        next: () => {
          this.mostrarAlerta('Organizador actualizado correctamente', 'success');
          this.editando = false;
          this.limpiar();
        },
        error: (err: HttpErrorResponse) =>
          this.mostrarAlerta(this.textoError(err, 'No se pudo actualizar el organizador.'), 'danger')
      });
    } else {
      const { id, ...datos } = this.nuevoOrg;
      this.orgService.agregar(datos).subscribe({
        next: () => {
          this.mostrarAlerta('Organizador registrado correctamente', 'success');
          this.limpiar();
        },
        error: (err: HttpErrorResponse) =>
          this.mostrarAlerta(this.textoError(err, 'No se pudo registrar el organizador.'), 'danger')
      });
    }
  }

  editar(org: Organizador): void {
    this.nuevoOrg = { ...org };
    this.editando = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number): void {
    if (!confirm('Esta seguro de eliminar este organizador?')) return;
    this.orgService.eliminar(id).subscribe({
      next: () => this.mostrarAlerta('Organizador eliminado', 'warning'),
      error: (err: HttpErrorResponse) =>
        this.mostrarAlerta(this.textoError(err, 'No se pudo eliminar el organizador.'), 'danger')
    });
  }

  cancelar(): void {
    this.editando = false;
    this.limpiar();
  }

  private limpiar(): void {
    this.nuevoOrg = this.orgVacio();
    this.mostrarPassword = false;
  }

  private orgVacio(): Organizador {
    return {
      id: 0,
      nombre: '',
      email: '',
      password: '',
      facultad: '',
      cargo: '',
      telefono: '',
      activo: true
    };
  }

  /** Toma el mensaje que envia el backend; si no hay, usa el texto por defecto. */
  private textoError(err: HttpErrorResponse, porDefecto: string): string {
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifique que el backend este ejecutandose.';
    }
    return err.error?.mensaje ?? porDefecto;
  }

  private mostrarAlerta(msg: string, tipo: string): void {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => (this.mensaje = ''), 4000);
  }
}
