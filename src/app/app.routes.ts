import { Routes } from '@angular/router';

import { HomeContenedor } from './components/home/home-contenedor/home-contenedor';
import { ComentariosComponent } from './components/comentarios/comentarios';
import { MostrarEvento } from './components/eventos/mostrar-evento/mostrar-evento';
import { FormEventos } from './components/eventos/form-eventos/form-eventos';
import { TablaEventos } from './components/eventos/tabla-eventos/tabla-eventos';

import { CuentaComponent } from './components/globales/cuenta/cuenta';

import { CrudPonentes } from './components/ponentes/crud-ponentes/crud-ponentes';
import { CrudRecursos } from './components/recursos/crud-recursos/crud-recursos';

import { CrudOrganizadores } from './components/organizadores/crud-organizadores/crud-organizadores';
import { DashboardOrganizador } from './components/organizadores/dashboard-organizador/dashboard-organizador';
import { ListaInscripciones } from './components/inscripciones/lista-inscripciones/lista-inscripciones';
import { FormInscripcion } from './components/inscripciones/form-inscripcion/form-inscripcion';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  // Rutas públicas
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeContenedor },
  { path: 'comentarios', component: ComentariosComponent },
  { path: 'evento/:id', component: MostrarEvento },
  { path: 'eventos', component: TablaEventos },
  { path: 'cuenta', component: CuentaComponent },

  // Rutas protegidas
  { path: 'crear-evento', component: FormEventos, canActivate: [authGuard] },
  { path: 'editar-evento/:id', component: FormEventos, canActivate: [authGuard] },
  { path: 'ponentes', component: CrudPonentes, canActivate: [authGuard] },
  { path: 'recursos', component: CrudRecursos, canActivate: [authGuard] },
  { path: 'organizadores', component: CrudOrganizadores, canActivate: [authGuard] },
  { path: 'dashboard-organizador', component: DashboardOrganizador, canActivate: [authGuard] },
  { path: 'inscripciones', component: ListaInscripciones, canActivate: [authGuard] },
  { path: 'nueva-inscripcion/:id', component: FormInscripcion, canActivate: [authGuard] },

  // Ruta por defecto
  { path: '**', redirectTo: 'home' }

];