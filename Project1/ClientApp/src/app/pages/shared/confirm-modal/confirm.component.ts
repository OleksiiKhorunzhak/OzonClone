import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  imports: [CommonModule]
})
export class ConfirmModalComponent {
  activeModal = inject(NgbActiveModal);
  
  @Input() title?: string;
	@Input() text?: string;

	@Input() yes?: string;
	@Input() no?: string;
}
