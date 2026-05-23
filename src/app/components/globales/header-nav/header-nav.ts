import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-nav',
  imports: [RouterLink],
  templateUrl: './header-nav.html',
  styleUrl: './header-nav.css',
})
export class HeaderNav {
  constructor(public authService: AuthService, private router: Router) {}

  get estaLogueado(): boolean {
    return this.authService.isLoggedIn();
  }

  get esOrganizador(): boolean {
    return this.authService.isOrganizador();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  irCuenta(): void {
    this.router.navigate(['/cuenta']);
  }
}

