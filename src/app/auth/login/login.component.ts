import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  loading = false;
  errorMessage: string = '';
  showPassword = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    this.errorMessage = 'Debes llenar todos los campos correctamente.';
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  const loginData = {
    correo: this.loginForm.value.email, 
    password: this.loginForm.value.password
  };

  this.authService.login(loginData).subscribe({
    next: (response) => {

      localStorage.setItem('token', response.token);

      this.router.navigate(['/admin/dashboard']);

      this.loading = false;
    },
    error: (err) => {
      this.errorMessage = err.error?.error || 'Error al iniciar sesión';
      this.loading = false;
    }
  });
}
}
