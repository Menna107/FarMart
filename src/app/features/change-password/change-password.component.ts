import { Component, inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  changePasswordForm: FormGroup = this.formBuilder.group(
    {
      currentPassword: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', [Validators.required]],
    },
    { validators: this.confirmPassword },
  );

  confirmPassword(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (password !== rePassword && rePassword !== '') {
      group.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  submitForm() {
    if (this.changePasswordForm.valid) {
      this.authService.changeUserPassword(this.changePasswordForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.toastService.show('Success', 'Password updated, please login again!', 'success');
            this.changePasswordForm.reset();
            this.authService.signOut();
            this.router.navigate(['/login']);
          }
        },
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
