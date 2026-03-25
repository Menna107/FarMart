import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submitForm() {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            // save token
            localStorage.setItem('token', res.token);

            // save user data
            localStorage.setItem('user', JSON.stringify(res.user));
            this.authService.isLogged.set(true);
            this.router.navigate(['/']);
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // Show and hide Password:
  showPassword(element: HTMLInputElement): void {
    if (element.type == 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  }

  socialLoginNotAvailable(platform: string) {
    this.toastService.show(
      'Coming Soon',
      `${platform} login will be available in the next update!`,
      'warning',
    );
  }
}
