import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prompt-modal',
  standalone: true,
  templateUrl: './prompt-modal.component.html',
  styleUrls: ['./prompt-modal.component.scss'],
  imports: [ CommonModule, FormsModule ]
})
export class PromptModalComponent {
  activeModal = inject(NgbActiveModal);

  @Input() title?: string;
	@Input() text?: string;

	@Input() yes?: string;
	@Input() no?: string;

  answer?: string;
}
