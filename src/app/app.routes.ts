import { Routes } from '@angular/router';
import { HomeContenedor } from './components/home/home-contenedor/home-contenedor';
import { ComentariosComponent} from './components/comentarios/comentarios';
import { MostrarEvento } from './components/eventos/mostrar-evento/mostrar-evento';
import { FormEventos } from './components/eventos/form-eventos/form-eventos';
import { TablaEventos } from './components/eventos/tabla-eventos/tabla-eventos';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeContenedor},
    {path:'comentarios',component: ComentariosComponent},
    {path: 'evento/:id', component: MostrarEvento},
    {path: 'crear-evento', component: FormEventos},
    {path: 'editar-evento/:id', component: FormEventos},
    {path: 'eventos', component: TablaEventos},
];
