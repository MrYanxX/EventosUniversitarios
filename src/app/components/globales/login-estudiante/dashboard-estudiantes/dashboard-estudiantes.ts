import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { StudentUser } from '../../../../models/usuarios';

@Component({
  selector: 'app-dashboard-estudiantes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-estudiantes.html',
  styleUrls: ['./dashboard-estudiantes.css']
})
export class DashboardEstudiantesComponent implements OnInit {
  estudiante: StudentUser | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    
    // Verificamos que el usuario exista y tenga el rol correcto
    if (!user || user.tipo !== 'estudiante') {
      this.router.navigate(['/cuenta']);
      return;
    }
    
    // Hacemos el cast seguro a StudentUser
    this.estudiante = user as StudentUser;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}