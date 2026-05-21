import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderNav } from "./components/globales/header-nav/header-nav";
import { Footer } from "./components/globales/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderNav, Footer] ,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EventosUniversitarios');
}
