import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: any[] = [];

  ngOnInit(): void {
    // En una aplicación real, estos datos se obtendrían de un servicio.
    this.users = [
      { _id: '60d5f3f77a1b2c001f9e1b2a', email: 'admin@example.com', name: 'Admin User' },
      { _id: '60d5f4f77a1b2c001f9e1b2b', email: 'test@example.com', name: 'Test User' }
    ];
  }
}
