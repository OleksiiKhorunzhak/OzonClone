import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';
import { ToastsService } from 'src/app/services/toasts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YesNoModalComponent } from '../../shared/yes-no-modal/yes-no-modal.component';

@Component({
  selector: 'app-pilot-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class PilotEndComponent implements OnInit, OnDestroy {
  flight!: Flight;
  dateNow = Date.now();
  isNextStep = false;
  subs: Subscription[] = [];
  endOptions: string[] = ['ЗЕМЛЯ', 'ВТРАЧЕНО'];
  flightId?: string|undefined;
  custom = '';

	private toastService = inject(ToastsService);

  constructor(
    private flightService: FlightService,
    private modalService: NgbModal) { }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  async ngOnInit(): Promise<void> {
    const s = this.flightService.activeFlight$.subscribe(flight => {
      if (flight) {
        this.flight = flight;
        this.flightId = this.flight._id;
      }
    });

    this.subs.push(s);
  }

  public validateStep() {
    return this.flight.boardingStatus == null || this.flight.boardingStatus == '';
  }

  public async next() {
    if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
      // alert('Не дозволено!');
      this.toastService.showError('Не дозволено!');
      return;
    }

    const modal = this.modalService.open(YesNoModalComponent);
    modal.componentInstance.text = `Ви впевнені? Статус: ${this.flight.boardingStatus}`;
    modal.componentInstance.yes = 'Так';
    modal.componentInstance.no = 'Ні';

    modal.closed.subscribe(async res => {
      if (res == true) {
        this.flight.endDate = new Date();
        this.flight.flightStep.step = FlightSteps.END;
        this.flight.flightStep.isApproved = true;
        this.flight.isRequireAttention = true;
    
        try {
          await this.flightService.updateFlightAsync(this.flight);
          await this.flightService.refreshActiveFlight();
        } catch (error) {
          if (error instanceof HttpErrorResponse)
            if (error.status == 200) {
              await this.flightService.refreshActiveFlight();
            } else {
              this.flight._id = this.flightId;
              this.flight.endDate = undefined;
              this.flight.flightStep.step = FlightSteps.REDUCTION;
            }
        }
      }
    })
  }
}
