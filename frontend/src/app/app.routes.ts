// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { JournalComponent } from './pages/journal/journal.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent, 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'signup', 
    component: SignupComponent 
  },
  { 
    path: 'profile', 
    component: ProfileComponent 
  },
  { 
    path: 'users', 
    component: UsersListComponent 
  },
  { 
    path: 'journal', 
    component: JournalComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];