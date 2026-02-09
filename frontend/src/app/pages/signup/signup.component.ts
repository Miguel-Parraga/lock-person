import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registroForm: FormGroup;
  mostrarPassword = false;  // Sin ñ
  cargando = false;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],  // Sin ñ
      confirmarPassword: ['', Validators.required],  // Sin ñ
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
    if (this.registroForm.valid) {
      this.cargando = true;
      console.log('Datos de registro:', this.registroForm.value);
    }
  }
}