import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatosRegistro } from '../../models/usuario';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registroForm: FormGroup;
  mostrarPassword = false;
  cargando = false;
  mensajeError: string = '';
  mensajeExito: string = '';
  debugInfo: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
      terminos: [false, Validators.requiredTrue]
    }, { 
      validators: this.validarPasswordsCoinciden 
    });
  }

  // Método para mostrar errores del formulario
  mostrarErroresFormulario(): void {
    console.log('🔍 Revisando errores del formulario:');
    
    if (this.registroForm.invalid) {
      console.log('❌ Formulario INVALIDO');
    } else {
      console.log('✅ Formulario VALIDO');
    }
    
    console.log('Estado general:', this.registroForm.status);
    console.log('Errores del grupo:', this.registroForm.errors);
    
    // Revisar cada control individualmente
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      if (control?.invalid) {
        console.log(`❌ Campo ${key}:`, {
          value: control.value,
          errors: control.errors,
          valid: control.valid,
          touched: control.touched,
          dirty: control.dirty
        });
      } else {
        console.log(`✅ Campo ${key}:`, {
          value: control?.value,
          valid: control?.valid
        });
      }
    });
  }

  validarPasswordsCoinciden(g: FormGroup): { [key: string]: boolean } | null {
    const password = g.get('password')?.value;
    const confirmar = g.get('confirmarPassword')?.value;
    
    return password && confirmar && password === confirmar 
      ? null 
      : { 'noCoinciden': true };
  }

  alternarVisibilidadPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit(): void {
    console.log('📝 Iniciando proceso de registro...');
    this.debugInfo = 'Iniciando registro...';
    
    if (this.registroForm.valid) {
      this.cargando = true;
      this.mensajeError = '';
      this.mensajeExito = '';

      // IMPORTANTE: El campo se llama "contraseña" en el modelo, pero en el formulario usamos "password"
      const datosRegistro: DatosRegistro = {
        email: this.registroForm.get('email')?.value,
        nombre: this.registroForm.get('nombre')?.value,
        contraseña: this.registroForm.get('password')?.value  // ← Aquí mapeamos password a contraseña
      };

      console.log('📤 Datos convertidos para backend:', {
        ...datosRegistro,
        contraseña: '***OCULTA***'
      });

      this.debugInfo = 'Enviando datos al servidor...';

      this.authService.signup(datosRegistro).subscribe({
        next: (response: any) => {
          console.log('✅ Respuesta del backend:', response);
          this.cargando = false;
          this.debugInfo = 'Respuesta recibida del servidor';
          
          if (response && response.estado === 'success') {
            this.mensajeExito = '¡Registro exitoso! Redirigiendo...';
            
            // El auth service ya guarda las credenciales automáticamente
            
            // Redirigir después de 1.5 segundos
            setTimeout(() => {
              this.router.navigate(['/dashboard']); // Cambia por tu ruta principal
            }, 1500);
          } else {
            this.mensajeError = response?.mensaje || 'Error desconocido en el registro';
            this.debugInfo = `Error: ${this.mensajeError}`;
          }
        },
        error: (error) => {
          console.error('❌ Error completo en registro:', error);
          this.cargando = false;
          
          // Información detallada para debugging
          this.debugInfo = `
            Status: ${error.status}
            Status Text: ${error.statusText}
            URL: ${error.url}
            Mensaje: ${error.message}
          `;
          
          if (error.error?.mensaje) {
            this.mensajeError = error.error.mensaje;
          } else if (error.status === 0) {
            this.mensajeError = 'No se puede conectar con el servidor. Verifica que esté corriendo en http://localhost:3000';
          } else if (error.status === 400) {
            this.mensajeError = 'Datos inválidos. Verifica la información.';
          } else if (error.status === 409 || error.status === 401) {
            this.mensajeError = error.error?.mensaje || 'Error de autenticación';
          } else {
            this.mensajeError = `Error ${error.status}: ${error.statusText || 'Error al registrar'}`;
          }
        },
        complete: () => {
          console.log('🎉 Proceso de registro completado');
          this.cargando = false;
          this.debugInfo = 'Proceso completado';
        }
      });
    } else {
      console.log('❌ Formulario inválido');
      this.debugInfo = 'Formulario inválido - revisa los errores';
      
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.registroForm.controls).forEach(key => {
        const control = this.registroForm.get(key);
        control?.markAsTouched();
        if (control?.errors) {
          console.log(`Campo ${key} errors:`, control.errors);
        }
      });
    }
  }

  // Métodos para pruebas
  probarConexionBackend(): void {
    this.debugInfo = 'Probando conexión con backend...';
    this.authService.testConnection().subscribe({
      next: (res) => {
        console.log('✅ Backend OK:', res);
        this.debugInfo = `✅ Backend funcionando: ${res.mensaje}`;
        this.mensajeExito = 'Backend conectado correctamente';
      },
      error: (err) => {
        console.error('❌ Backend error:', err);
        this.debugInfo = `❌ Error backend: ${err.message}`;
        this.mensajeError = 'No se puede conectar al backend';
      }
    });
  }

  probarConexionDatabase(): void {
    this.debugInfo = 'Probando conexión con base de datos...';
    this.authService.testDatabase().subscribe({
      next: (res) => {
        console.log('✅ Database OK:', res);
        this.debugInfo = `✅ Base de datos: ${res.mensaje}`;
        this.mensajeExito = 'Base de datos conectada';
      },
      error: (err) => {
        console.error('❌ Database error:', err);
        this.debugInfo = `❌ Error BD: ${err.message}`;
        this.mensajeError = 'Error en conexión a base de datos';
      }
    });
  }

  limpiarMensajes(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.debugInfo = '';
  }

  // Ver estado del formulario
  mostrarEstadoFormulario(): void {
    console.log('📋 Estado del formulario:');
    console.log('Válido:', this.registroForm.valid);
    console.log('Valores:', this.registroForm.value);
    console.log('Errores:', this.registroForm.errors);
    
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      console.log(`${key}:`, {
        value: control?.value,
        valid: control?.valid,
        errors: control?.errors,
        touched: control?.touched
      });
    });
  }
}