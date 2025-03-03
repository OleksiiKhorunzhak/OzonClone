import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, interval, takeUntil } from 'rxjs';
import { ValueColor } from 'src/app/models/droneModel';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsService } from 'src/app/services/toasts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PromptModalComponent } from '../shared/prompt-modal/prompt-modal.component';

export interface CheckedFlight extends Flight {
  isShowStepChengedSign?: boolean,
  isHideBrigateView?: boolean
}

export interface CompletedFlight {
  flight: CheckedFlight,
  msElapsed: number,
}

export interface CheckedFlights {
  checkedLBZForwardChange: string[],
  checkedLBZBackChange: string[],
  checkedIsApproved: string[]
}


@Component({
  selector: 'app-brigade-ppo',
  templateUrl: './brigade.component.html',
  styleUrls: ['./brigade.component.scss']
})


export class BrigadeComponent implements OnInit, OnDestroy {

  flights: CheckedFlight[] = [];

  options: DroneOptions = {};
  userRole?: UserRole;
  refreshFlightSubscription?: Subscription;

  interval_ms = 10000;
  private readonly timeRangeMinutes = 5;
  endOptions: string[] = ['ЗЕМЛЯ', 'ВТРАЧЕНО'];

  flightStatuses: ValueColor[] = [];

  completedFlights: CompletedFlight[] = [];

  dateNow = new Date();

  gotError$ = new Subject<void>();


  constructor(private flightService: FlightService,
    private optionsService: OptionsService,
    private userService: UserService,
    private toastsService: ToastsService) {
  }

  ngOnDestroy(): void {
    this.refreshFlightSubscription?.unsubscribe();
  }

  toggleSection(flight: Flight) {
    flight.isExpanded = !flight.isExpanded;

    const checkedFlights = this.getCheckedFlights();

    if (flight.isForwardChanged === true && !checkedFlights.checkedLBZForwardChange.includes(flight._id!)) {
      checkedFlights.checkedLBZForwardChange.push(flight._id!);
      flight.isChecked = true;
    }

    if (flight.isReturnChanged === true && !checkedFlights.checkedLBZBackChange.includes(flight._id!)) {
      checkedFlights.checkedLBZBackChange.push(flight._id!);
      flight.isChecked = true;
    }

    if (flight.flightStep.isApproved == true && !checkedFlights.checkedIsApproved.includes(flight._id!)) {
      checkedFlights.checkedIsApproved.push(flight._id!);
      flight.isChecked = true;
    }

    this.saveCheckedFlights(checkedFlights);
  }

  async ngOnInit(): Promise<void> {
    await this.getOptions();
    await this.initFlights();

    var ui = this.userService.getUserInfo();

    if (ui) {
      this.userRole = ui.role;
    }

    if (this.options.flightStatus) {
      this.flightStatuses = this.options.flightStatus;
    }

    this.refreshFlightSubscription = interval(this.interval_ms).pipe(takeUntil(this.gotError$)).subscribe(async x => {
      this.completedFlights.forEach(flight => {
        flight.msElapsed += this.interval_ms;
      })

      this.flights = this.flights.filter(x => !this.completedFlights.find(completed => completed.flight._id === x._id))
      this.completedFlights = this.completedFlights.filter(x => x.msElapsed < (this.interval_ms * 5));
      await this.initFlights();
    })
  }

  public async getOptions() {
    try {
      this.options = await this.optionsService.getAllOptions();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {

      } else {
        this.toastsService.showError("Сталась помилка. Оновіть сторінку і спробуйте знову.");
      }
    }
  }

  async initFlights() {
    const nonCollapsedFlights = this.flights.filter(x => x.isExpanded === true);
    const collapsedFlights = this.flights.filter(x => x.isExpanded == false);

    try {
      const allFlights = await this.flightService.getFlightsWithTimeRange(this.timeRangeMinutes);

      const filtered = allFlights.filter(x => !x.isRejected);

      const newFlights: CheckedFlight[] = [];

      const notApprovedFlights = filtered.filter(x => x.flightStep.isApproved === false)

      newFlights.push(...notApprovedFlights)

      newFlights.push(...filtered.filter(x => x.flightStep.step == FlightSteps.START && x.flightStep.isApproved === true));

      this.options.dronAppointment?.forEach(c => {
        newFlights.push(...filtered.filter(x =>
          x.flightStep.isApproved === true
          && x.flightStep.step != FlightSteps.START
          && x.assignment?.name === c.name
          && x.flightStep.step !== FlightSteps.END).sort((a: Flight, b: Flight) => {
            const stepA = new Date(a.dateOfFlight ?? '').getTime();
            const stepB = new Date(b.dateOfFlight ?? '').getTime();
            return stepA - stepB;
          }));
      });

      newFlights.push(...filtered.filter(x => x.flightStep.step === FlightSteps.END).sort((a: Flight, b: Flight) => {
        const endDateA = new Date(a.endDate ?? '').getTime();
        const endDateB = new Date(b.endDate ?? '').getTime();
        return endDateB - endDateA;
      }));

      newFlights.forEach(flight => {

        this.calculateTimePassed(flight);

        if (flight.flightStep.step == FlightSteps.END) {
          flight.flightStep.visibleStep = FlightSteps.END;
          flight.assignment!.color = 'gray';
          if (!this.endOptions.includes(flight.boardingStatus ?? '')) {
            flight.boardingStatus = 'Інше';
          }
        }
      });

      newFlights.forEach(updatedFlight => {
        // Find the corresponding collapsed flight
        const nonCollapsedFlight = nonCollapsedFlights.find(flight => flight._id === updatedFlight._id);
        if (nonCollapsedFlight && nonCollapsedFlight.isExpanded !== updatedFlight.isExpanded) {
          updatedFlight.isExpanded = nonCollapsedFlight.isExpanded;
        }else{
          const collapsedFlight = collapsedFlights.find(flight => flight._id == updatedFlight._id);
          if(collapsedFlight){
            updatedFlight.isExpanded = collapsedFlight.isExpanded;
          }
        }
      });

      const checkedFlights = this.getCheckedFlights();

      newFlights.forEach(flight => {
        flight.isChecked = checkedFlights.checkedIsApproved.includes(flight._id!);

        if (flight.isForwardChanged === true) {
          flight.isChecked = checkedFlights.checkedLBZForwardChange.includes(flight._id!);
        }

        if (flight.isReturnChanged === true) {
          flight.isChecked = checkedFlights.checkedLBZBackChange.includes(flight._id!);
        }

        if (flight.isChecked !== true || flight.isExpanded === true) {
          flight.isExpanded = true;
        }
      });

      const filteredChecks: CheckedFlights = {
        checkedIsApproved: checkedFlights.checkedIsApproved.filter(id => newFlights.some(x => x._id == id)),
        checkedLBZBackChange: checkedFlights.checkedLBZBackChange.filter(id => newFlights.some(x => x._id == id)),
        checkedLBZForwardChange: checkedFlights.checkedLBZForwardChange.filter(id => newFlights.some(x => x._id == id))
      };

      this.saveCheckedFlights(filteredChecks);

      // Insert filtered flights
      this.flights = [];
      this.flights = [...newFlights];


    } catch (error) {
      if (error instanceof HttpErrorResponse) {
      } else {
        this.toastsService.showError("Сталась помилка. Оновіть сторінку і спробуйте знову.");
      }

      this.gotError$.next();
      this.gotError$.complete();
    }
  }

  public getCheckedFlights(): CheckedFlights {
    const item = localStorage.getItem(this.CHECKED_FLIGHTS_KEY);

    const empty = {
      checkedIsApproved: [],
      checkedLBZBackChange: [],
      checkedLBZForwardChange: []
    }

    if (item != null) {
      const parsed: CheckedFlights = JSON.parse(item);
      return (parsed.checkedIsApproved && parsed.checkedLBZBackChange && parsed.checkedLBZForwardChange) ? parsed : empty;
    }

    return empty;
  }

  public saveCheckedFlights(checkedFlights: CheckedFlights) {
    localStorage.setItem(this.CHECKED_FLIGHTS_KEY, JSON.stringify(checkedFlights));
  }

  private readonly CHECKED_FLIGHTS_KEY = 'CHECKED_FLIGHTS';

  public get FlightSteps() {
    return FlightSteps;
  }

  public get UserRoles() {
    return UserRole;
  }

  private calculateTimePassed(flight: Flight) {
    let dateFrom = null;

    switch (flight.flightStep.visibleStep) {
      case FlightSteps.START:
        dateFrom = flight.dateOfFlight
        break;
      case FlightSteps.FLIGHT:
        dateFrom = flight.flightStartDate
        break;
      case FlightSteps.LBZ_FORWARD:
        dateFrom = flight.LBZForwardDate
        break;
      case FlightSteps.LBZ_HOME:
        dateFrom = flight.LBZBackDate
        break;
      case FlightSteps.REDUCTION:
        dateFrom = flight.reductionDate
        break;
      case FlightSteps.RETURN:
        dateFrom = flight.returnDate
        break;
    }

    if (dateFrom != null) {
      const diff = new Date().getTime() - new Date(dateFrom).getTime();

      const minutes = Math.floor(diff / 1000 / 60);

      if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        flight.timeFromLastStep = `${hours} г ${minutes - (hours * 60)} хв.`
      } else {
        flight.timeFromLastStep = `${minutes} хв.`
      }

    } else {
      flight.timeFromLastStep = '';
    }
  }
}
