import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  remove(id: number) {
    this.toastService.hide(id);
  }

  getBgClass(type: string) {
    const styles: any = {
      warning: 'bg-[#FEECEC] border-[#F8D7DA]',
      success: 'bg-[#E6F9F1] border-[#B8EBD0]',
    };
    return styles[type];
  }

  getTextClass(type: string) {
    const styles: any = {
      warning: 'text-[#B02A37]',
      success: 'text-[#198754]',
    };
    return styles[type];
  }

  getIconClass(type: string) {
    return this.getTextClass(type);
  }
}
