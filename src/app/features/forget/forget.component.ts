import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-forget',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.css',
})
export class ForgetComponent {
  step = signal<number>(1);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  email: FormControl = new FormControl('', [Validators.required]);
  code: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  ]);
  confirmPassword: FormControl = new FormControl('', [Validators.required]);

  submitEmail(event: Event) {
    event.preventDefault();

    if (this.email.valid) {
      const data = {
        email: this.email.value,
      };

      this.authService.forgetPassword(data).subscribe({
        next: (res) => {
          this.step.set(2);
          this.toastService.show(res.statusMsg, res.message, 'success');
        },
      });
    }
  }

  submitCode(event: Event) {
    event.preventDefault();

    if (this.code.valid) {
      const data = {
        resetCode: this.code.value,
      };

      this.authService.verifyCode(data).subscribe({
        next: (res) => {
          this.toastService.show(res.status, 'Code Sent Successfully', 'success');
          this.step.set(3);
        },
      });
    }
  }

  resendCode() {
    if (this.email.valid) {
      const data = {
        email: this.email.value,
      };

      this.authService.forgetPassword(data).subscribe({
        next: (res) => {
          this.toastService.show(res.status, 'Code Sent Successfully', 'success');
        },
      });
    }
  }

  submitPassword(event: Event) {
    event.preventDefault();

    if (this.password.value !== this.confirmPassword.value) {
      this.confirmPassword.setErrors({ mismatch: true });
      return;
    }

    if (this.password.valid && this.confirmPassword.valid) {
      const data = {
        email: this.email.value,
        newPassword: this.password.value,
      };

      this.authService.resetPassword(data).subscribe({
        next: (res) => {
          this.step.set(4);

          this.toastService.show(res.status, 'Password Updated Successfully', 'success');
        },
      });
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
}
