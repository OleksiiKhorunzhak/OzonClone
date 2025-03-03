import { Component, OnInit, inject } from '@angular/core';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';
import { YesNoModalComponent } from '../../shared/yes-no-modal/yes-no-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsService } from 'src/app/services/toasts.service';
import { PromptModalComponent } from '../../shared/prompt-modal/prompt-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-pilot-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class PilotFlightComponent implements OnInit {
    flights: Flight[] = [];
    flight!: Flight;
    userInfo!: User;
    localRouterPath!: string;
    isNewFlight: boolean = true;
    dateNow = Date.now();
    flightId?: string|undefined;

    private toastService = inject(ToastsService);

    constructor(
      private flightService: FlightService,
      private userService: UserService,
      private modalService: NgbModal) { }

    async ngOnInit(): Promise<void> {

      const ui = this.userService.getUserInfo();
  
      if (ui) {
        this.userInfo = ui;
  
        this.flightService.activeFlight$.subscribe(flight => {
          if (flight) {
            this.flight = flight;
            if(this.flight._id != undefined){
              this.flightId = this.flight._id;
            }
          }
        });
      }
      
    }
  
    public async next() {
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
          this.flight.flightStartDate = new Date();
          this.flight.flightStep.step = FlightSteps.FLIGHT;
          this.flight.flightStep.visibleStep = FlightSteps.FLIGHT;
          this.flight.flightStep.isApproved = true;
          this.flight.isRequireAttention = true;
          try {
            await this.flightService.updateFlightAsync(this.flight);
            await this.flightService.refreshActiveFlight();
          } catch (error) {
            console.log(error)
            if (error instanceof HttpErrorResponse) {
              if (error.status == 200) {
                await this.flightService.refreshActiveFlight();
              } else {
                this.flight._id = this.flightId;
                this.flight.flightStartDate = undefined;
                this.flight.flightStep.step = FlightSteps.START;
                this.flight.flightStep.visibleStep = FlightSteps.START;
              }
            }
          }
        }
      });
    }
  
    public async terminateFlight(isApproved: boolean) {

      const modal = this.modalService.open(PromptModalComponent);
      modal.componentInstance.text = 'Введіть причину скасування.';
      modal.componentInstance.yes = 'Ок';
      modal.componentInstance.no = 'Назад';

      modal.closed.subscribe(async res => {
        if (res !== null) {
          this.flight.isTerminated = true;
          this.flight.terminatedPilotReason = res;
          this.flight.endDate = new Date();
          this.flight.flightStep.step = FlightSteps.END;
          this.flight.flightStep.visibleStep = FlightSteps.END;
          this.flight.flightStep.isApproved = isApproved;

          try {
            await this.flightService.updateFlightAsync(this.flight);
            await this.flightService.refreshActiveFlight();
          } catch (error) {
            this.flight.isTerminated = undefined;
            this.flight.terminatedPilotReason = undefined;
            this.flight.endDate = undefined;
            this.flight.flightStep.step = FlightSteps.START;
            this.flight.flightStep.visibleStep = FlightSteps.START;
          }
        }
      });
    }

  
    public get FlightSteps() {
      return FlightSteps;
    }
}