import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


interface User {
  _id: string;
  email: string;
  name: string;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    // this.userService.getUsers().subscribe({
    //   next: (data) => {
    //     this.users = data;
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading users:', error);
    //     this.isLoading = false;
    //   }
    // });
    
    // Datos de ejemplo
    setTimeout(() => {
      this.users = [
        { _id: '1', email: 'usuario1@example.com', name: 'Juan Pérez' },
        { _id: '2', email: 'usuario2@example.com', name: 'María García' }
      ];
      this.isLoading = false;
    }, 1000);
  }
}