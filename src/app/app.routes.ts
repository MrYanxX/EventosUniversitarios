import { Routes } from '@angular/router';

import { HomeContenedor } from './components/home/home-contenedor/home-contenedor';
import { ComentariosComponent } from './components/comentarios/comentarios';
import { MostrarEvento } from './components/eventos/mostrar-evento/mostrar-evento';
import { FormEventos } from './components/eventos/form-eventos/form-eventos';
import { TablaEventos } from './components/eventos/tabla-eventos/tabla-eventos';

import { CuentaComponent } from './components/globales/login-estudiante/estudiante';

import { CrudPonentes } from './components/ponentes/crud-ponentes/crud-ponentes';
import { CrudRecursos } from './components/recursos/crud-recursos/crud-recursos';

import { CrudOrganizadores } from './components/organizadores/crud-organizadores/crud-organizadores';
import { DashboardOrganizador } from './components/organizadores/dashboard-organizador/dashboard-organizador';
import { ListaInscripciones } from './components/inscripciones/lista-inscripciones/lista-inscripciones';
import { FormInscripcion } from './components/inscripciones/form-inscripcion/form-inscripcion';

import { authGuard } from './guards/auth-guard';
import { DashboardEstudiantesComponent } from './components/globales/login-estudiante/dashboard-estudiantes/dashboard-estudiantes';

export const routes: Routes = [

  // Rutas públicas
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeContenedor },
  { path: 'comentarios', component: ComentariosComponent },
  { path: 'evento/:id', component: MostrarEvento },
  { path: 'crear-evento', component: FormEventos },
  { path: 'editar-evento/:id', component: FormEventos },
  { path: 'eventos', component: TablaEventos },
  { path: 'cuenta', component: CuentaComponent },
  { path: 'organizadores', component: CrudOrganizadores },
  { path: 'dashboard-organizador', component: DashboardOrganizador },
  { path: 'inscripciones', component: ListaInscripciones },
  { path: 'nueva-inscripcion/:id', component: FormInscripcion },
  { path: 'dashboard-estudiante', component: DashboardEstudiantesComponent},
  { path: 'ponentes', component: CrudPonentes },
  { path: 'recursos', component: CrudRecursos },

  // Ruta por defecto
  { path: '**', redirectTo: 'home' }

];