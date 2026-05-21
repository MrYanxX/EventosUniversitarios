import { Routes } from '@angular/router';
import { HomeContenedor } from './components/home/home-contenedor/home-contenedor';
import { ComentariosComponent} from './components/comentarios/comentarios';
import { MostrarEvento } from './components/eventos/mostrar-evento/mostrar-evento';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeContenedor},
    {path:'comentarios',component: ComentariosComponent},
    {path: 'evento/:id', component: MostrarEvento}
];
