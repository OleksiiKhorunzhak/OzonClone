import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
	classname?: string;
	delay?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  toasts: Toast[] = [];

  showToast$ = new Subject<Toast>();

  showSuccess(message: string) {
    this.toasts.push({
      classname: 'bg-success text-light',
      delay: 5000,
      message
    });

  }

  showError(message: string) {
    this.toasts.push({
      classname: 'bg-danger text-light',
      delay: 5000,
      message
    });
  }

  showWarning(message: string) {
    this.toasts.push({
      classname: 'bg-warning text-dark',
      delay: 5000,
      message
    });
  }

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
