import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';
import { YesNoModalComponent } from '../../shared/yes-no-modal/yes-no-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsService } from 'src/app/services/toasts.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pilot-reduction',
  templateUrl: './reduction.component.html',
  styleUrls: ['./reduction.component.scss']
})
export class PilotReductionComponent implements OnInit, OnDestroy {
  flight!: Flight;
  dateNow = Date.now();
  isNextStep = false;
  subs: Subscription[] = [];
  reductions = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  flightId?: string|undefined;

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

  public async next(isSkipped = false) {
    if (this.flight.flightStep.isApproved == false && this.flight.flightStep.step === FlightSteps.START) {
      // alert('Не дозволено!');
      this.toastService.showError('Не дозволено!');
      return;
    }

    const modal = this.modalService.open(YesNoModalComponent);
    modal.componentInstance.text = 'Ви впевнені?';
    modal.componentInstance.yes = 'Так';
    modal.componentInstance.no = 'Ні';

    modal.closed.subscribe(async res => {
      if (res == true) {
        await this.nextStep(isSkipped);
      }
    });
  }

  public async nextStep(isSkipped: boolean) {
    this.flight.flightStep.step = FlightSteps.REDUCTION;
    this.flight.flightStep.isApproved = true;

    if (!isSkipped) {
      this.flight.reductionDate = new Date();
      this.flight.flightStep.visibleStep = FlightSteps.REDUCTION;
    }

    try {
      await this.flightService.updateFlightAsync(this.flight);
      await this.flightService.refreshActiveFlight();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status == 200) {
          await this.flightService.refreshActiveFlight();
        } else { 
          this.flight.flightStep.step = FlightSteps.LBZ_HOME;
          this.flight.flightStep.isApproved = true;
          this.flight._id = this.flightId;
          if (!isSkipped) {
            this.flight.reductionDate = undefined;
            this.flight.flightStep.visibleStep = FlightSteps.LBZ_HOME;
            this.flight._id = this.flightId;
          }
        }
      }
    }
  }

  public validateStep() {
    return this.flight.reductionDistance == null || this.flight.reductionLocation == null || this.flight.reductionLocation == ''
  }
}

