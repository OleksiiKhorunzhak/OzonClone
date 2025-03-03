import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-yes-no-modal',
  standalone: true,
  templateUrl: './yes-no-modal.component.html',
  styleUrls: ['./yes-no-modal.component.scss'],
  imports: [CommonModule]
})
export class YesNoModalComponent {
  activeModal = inject(NgbActiveModal);

  @Input() title?: string;
	@Input() text?: string;

	@Input() yes?: string;
	@Input() no?: string;
}
