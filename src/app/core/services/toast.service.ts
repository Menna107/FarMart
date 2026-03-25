import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(title: string, message: string, type: Toast['type'] = 'error') {
    const id = Date.now();
    this.toasts.update((t) => [...t, { id, title, message, type }]);

    setTimeout(() => this.hide(id), 4000);
  }

  hide(id: number) {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }
}
