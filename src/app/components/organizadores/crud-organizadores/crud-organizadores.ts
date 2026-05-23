import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  nuevoOrg: Organizador = this.orgVacio();

  constructor(public orgService: OrganizadorService) {}

  ngOnInit(): void {
    this.orgService.cargar().subscribe();
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
      this.orgService.actualizar(this.nuevoOrg);
      this.mostrarAlerta('Organizador actualizado correctamente', 'success');
      this.editando = false;
    } else {
      const { id, ...datos } = this.nuevoOrg;
      this.orgService.agregar(datos);
      this.mostrarAlerta('Organizador registrado correctamente', 'success');
    }
    this.limpiar();
  }

  editar(org: Organizador): void {
    this.nuevoOrg = { ...org };
    this.editando = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar este organizador?')) return;
    this.orgService.eliminar(id);
    this.mostrarAlerta('Organizador eliminado', 'warning');
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

  private mostrarAlerta(msg: string, tipo: string): void {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => (this.mensaje = ''), 3500);
  }
}
