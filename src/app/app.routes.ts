import { Routes } from '@angular/router';
import { HomeContenedor } from './components/home/home-contenedor/home-contenedor';
import { ComentariosComponent} from './components/comentarios/comentarios';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeContenedor},
    {path:'comentarios',component: ComentariosComponent}
];
