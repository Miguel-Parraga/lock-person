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