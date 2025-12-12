import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,  // ¡AGREGAR ESTA LÍNEA!
  imports: [CommonModule, RouterOutlet, NavbarComponent],  // ¡AGREGAR ESTOS IMPORTS!
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Lock Person';
}