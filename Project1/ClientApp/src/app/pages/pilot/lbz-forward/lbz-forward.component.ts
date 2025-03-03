import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { FlightService } from 'src/app/services/flight.service';
import { YesNoModalComponent } from '../../shared/yes-no-modal/yes-no-modal.component';
import { ToastsService } from 'src/app/services/toasts.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pilot-lbz-forward',
  templateUrl: './lbz-forward.component.html',
  styleUrls: ['./lbz-forward.component.scss']
})

export class PilotLbzForwardComponent implements OnInit, OnDestroy {
  flight!: Flight;
  dateNow = Date.now();
  isNextStep = false;
  isChangeRoute = false;
  subs: Subscription[] = [];
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
      if (res === true) {
        await this.nextStep(isSkipped);
      }
    });
  }

  public async nextStep(isSkipped: boolean) {
    if (this.isChangeRoute) {
      this.flight.isForwardChanged = true;
      this.flight.isRequireAttention = true;
    } else {
      this.flight.isRequireAttention = false;
    }
    
    this.flight.flightStep.step = FlightSteps.LBZ_FORWARD;
    this.flight.flightStep.isApproved = true;

    if (!isSkipped) {
      this.flight.LBZForwardDate = new Date();
      this.flight.flightStep.visibleStep = FlightSteps.LBZ_FORWARD;
    }
    try {
      await this.flightService.updateFlightAsync(this.flight);
      await this.flightService.refreshActiveFlight();
    } catch (error) {
      if (error instanceof HttpErrorResponse)
        if (error.status == 200) {
          await this.flightService.refreshActiveFlight();
        } else {
          this.flight.flightStep.step = FlightSteps.FLIGHT;
          this.flight.flightStep.isApproved = true;
          this.flight._id = this.flightId;
          if (!isSkipped) {
            this.flight.LBZForwardDate = undefined;
            this.flight.flightStep.visibleStep = FlightSteps.FLIGHT;
          }
        }
    }
}

  public validateStep() {
    return this.flight.changedForwardRoute == null || this.flight.changedForwardRoute == ''
  }

  public get FlightSteps() {
    return FlightSteps;
  }

  async changeRoute() {
    const modal = this.modalService.open(YesNoModalComponent);
    modal.componentInstance.text = 'Ви впевнені?';
    modal.componentInstance.yes = 'Так';
    modal.componentInstance.no = 'Ні';
  
    modal.closed.subscribe(res => {
      if (res === true) {
        this.isChangeRoute = true;
      }
    });
  }
}