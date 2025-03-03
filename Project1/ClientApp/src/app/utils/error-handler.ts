import { ErrorHandler, inject } from "@angular/core";
import { ToastsService } from "../services/toasts.service";

export class AppErrorHandler implements ErrorHandler {

  private toastService = inject(ToastsService);

  handleError(error: any) {
    // this.toastService.showError("Сталась помилка. Оновіть сторінку і спробуйте знову.");
    console.error(error);
  }
}