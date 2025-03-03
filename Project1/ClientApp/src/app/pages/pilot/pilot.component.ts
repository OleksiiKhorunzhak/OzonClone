import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FLIGHT_ROUTES } from 'src/app/consts/consts';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pilot',
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.scss']
})
export class PilotComponent implements OnInit {
  userRoles = UserRole;

  userInfo: User = {};

  dateNow = Date.now();

  isNewFlight: boolean = true;

  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: []
  };

  flight!: Flight;

  isRequestOpened = false;

  constructor(
    private router: Router,
    private flightService: FlightService,
    private optionsService: OptionsService,
    private userService: UserService,
    private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.options = await this.optionsService.getAllOptions();

    const ui = this.userService.getUserInfo();

    if (ui) {
      this.userInfo = ui;

      await this.flightService.refreshActiveFlight();

      this.flightService.activeFlight$.subscribe(flight => {
        this.handleRouting(flight);

        if (flight) {
          this.flight = flight;
        } else {
          this.flight = {
            isRequireAttention: false,
            flightStep: {
              step: FlightSteps.START,
              isApproved: false,
              isApprovedByPPO: false,
              isApprovedByREB: false,
            },
            dateOfFlight: new Date()
          };
        }
      });
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    window.location.reload();
  }

  private handleRouting(flight: Flight | null, usePrev = false) {
    if (!flight) {
      if (usePrev === true) {
        this.router.navigate(["flight/" + FLIGHT_ROUTES.START, 'prev']);
      } else {
        this.router.navigate(["flight/" + FLIGHT_ROUTES.START, 'new']);
      }
      return;
    }

    if (flight.flightStep.step === FlightSteps.START && flight.flightStep.isApproved === false) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.WAITING_APPROVAL]);
      return;
    }

    if (flight.flightStep.step === FlightSteps.START && flight.flightStep.isApproved === true) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.FLIGHT]);
    }

    if (flight.flightStep.step === FlightSteps.FLIGHT) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.LBZ_FORWARD]);
    }

    if (flight.flightStep.step === FlightSteps.LBZ_FORWARD) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.RETURN]);
    }

    if (flight.flightStep.step === FlightSteps.RETURN) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.LBZ_HOME]);
    }

    if (flight.flightStep.step === FlightSteps.LBZ_HOME) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.REDUCTION]);
    }

    if (flight.flightStep.step === FlightSteps.REDUCTION) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.END]);
    }

    if (flight.flightStep.step === FlightSteps.END) {
      this.router.navigate(["flight/" + FLIGHT_ROUTES.START]);
      this.isRequestOpened = false;
    }
  }

  public navigateToDiscordUrl() {
    window.open(this.options.discordUrl, '_blank')!.focus();
  }

  public async terminateFlight(isApproved: boolean) {
    this.flight.isTerminated = true;
    this.flight.endDate = new Date;
    this.flight.flightStep.step = FlightSteps.END;
    this.flight.flightStep.isApproved = isApproved;

    await this.flightService.updateFlightAsync(this.flight);
    await this.flightService.refreshActiveFlight();
  }

  public async getLastFlight(isApproved: boolean){
    this.flight.isTerminated = true;
    this.flight.endDate = new Date;
    this.flight.flightStep.step = FlightSteps.END;
    this.flight.flightStep.isApproved = isApproved;

    await this.flightService.updateFlightAsync(this.flight);
    this.flight.isRejected = false;
    this.handleRouting(null, true);
  }

  public validateStep(step: FlightSteps) {
    // TODO: refactor later

    switch (step) {
      case FlightSteps.START:
        return this.flight.isInDiscord !== true
          || this.flight.assignment == null
          || this.flight.model == null
          || this.flight.operator == null || this.flight.operator === ''

    }
    return false;
  }

  public navigateToRequest() {
    this.isRequestOpened = !this.isRequestOpened;
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
