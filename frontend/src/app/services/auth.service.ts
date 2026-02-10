import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario, DatosRegistro } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // IMPORTANTE: Asegúrate que este puerto coincida con tu backend
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.cargarUsuarioDesdeStorage();
  }

  private cargarUsuarioDesdeStorage(): void {
    const savedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
        console.log('✅ Usuario cargado desde localStorage:', user.email);
      } catch (error) {
        console.error('❌ Error al cargar usuario:', error);
        this.limpiarStorage();
      }
    }
  }

  signup(userData: DatosRegistro): Observable<any> {
    // IMPORTANTE: El campo debe llamarse "contraseña" como espera el backend
    const datosParaBackend = {
      email: userData.email,
      nombre: userData.nombre,
      contraseña: userData.contraseña // ← clave aquí: debe ser "contraseña" no "password"
    };

    console.log('📤 Enviando registro al backend:', {
      ...datosParaBackend,
      contraseña: '***OCULTA***'
    });
    
    return this.http.post(`${this.apiUrl}/auth/registro`, datosParaBackend)
      .pipe(
        tap((response: any) => {
          console.log('✅ Respuesta del backend:', response);
          if (response && response.estado === 'success') {
            this.guardarCredenciales(response.token, response.usuario);
          }
        }),
        catchError(error => {
          console.error('❌ Error en auth.service:', error);
          return throwError(() => error);
        })
      );
  }

  login(email: string, contraseña: string): Observable<any> {
    // IMPORTANTE: El campo debe llamarse "contraseña"
    const datosLogin = { 
      email, 
      contraseña // ← clave aquí: debe ser "contraseña" no "password"
    };
    
    console.log('📤 Enviando login al backend:', {
      ...datosLogin,
      contraseña: '***OCULTA***'
    });
    
    return this.http.post(`${this.apiUrl}/auth/login`, datosLogin)
      .pipe(
        tap((response: any) => {
          console.log('✅ Respuesta login:', response);
          if (response && response.estado === 'success') {
            this.guardarCredenciales(response.token, response.usuario);
          }
        }),
        catchError(error => {
          console.error('❌ Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  private guardarCredenciales(token: string, usuario: any): void {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    this.currentUserSubject.next(usuario);
    console.log(`🔐 Credenciales guardadas para usuario: ${usuario.email}`);
    console.log(`👤 Usuario ID: ${usuario.id}`);
  }

  logout(): void {
    console.log('👋 Cerrando sesión...');
    this.limpiarStorage();
    this.router.navigate(['/login']);
  }

  private limpiarStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('🗑️ Almacenamiento limpiado');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  // Para pruebas de conexión
  testConnection(): Observable<any> {
    console.log('🔍 Probando conexión con backend...');
    return this.http.get(`${this.apiUrl}/health`);
  }

  testDatabase(): Observable<any> {
    console.log('🔍 Probando conexión con base de datos...');
    return this.http.get(`${this.apiUrl}/test-db`);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}