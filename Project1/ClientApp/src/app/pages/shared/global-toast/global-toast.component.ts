import { Component, OnDestroy, inject } from '@angular/core';
import { ToastsService } from 'src/app/services/toasts.service';

@Component({
  selector: 'app-global-toast',
  templateUrl: './global-toast.component.html',
  styleUrls: ['./global-toast.component.scss']
})
export class GlobalToastComponent implements OnDestroy {

	private toastService = inject(ToastsService);

	ngOnDestroy(): void {
		this.toastService.clear();
	}

}
