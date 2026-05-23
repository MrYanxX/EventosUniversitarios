import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { OrganizerUser } from '../../../models/usuarios';

@Component({
  selector: 'app-dashboard-organizador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-organizador.html',
  styleUrls: ['./dashboard-organizador.css']
})
export class DashboardOrganizador implements OnInit {
  organizador: OrganizerUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.tipo !== 'organizador') {
      this.router.navigate(['/cuenta']);
      return;
    }
    this.organizador = user as OrganizerUser;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
