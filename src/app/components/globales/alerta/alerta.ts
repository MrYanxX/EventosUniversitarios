import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerta.html',
  styleUrl: './alerta.css'
})
export class Alerta {

  @Input() mensaje: string = '';

  @Input() tipo: string = 'success';

}