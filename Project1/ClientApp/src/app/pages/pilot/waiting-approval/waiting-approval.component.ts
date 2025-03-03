import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { ValueColor } from 'src/app/models/droneModel';
import { Flight } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { OptionsService } from 'src/app/services/options.service';
import { ToastsService } from 'src/app/services/toasts.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pilot-waiting-approval',
  templateUrl: './waiting-approval.component.html',
  styleUrls: ['./waiting-approval.component.scss']
})
export class WaitingApprovalComponent implements OnInit, OnDestroy {
  userRole?: UserRole;

  userInfo: User = {};

  flightStatuses: ValueColor[] = [];

  flight: Flight | null = null;

  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: []
  };

  interval_ms = 10000;
  refreshFlightSubscription?: Subscription;

  constructor(
    private flightService: FlightService,
    private optionsService: OptionsService,
    private toastsService: ToastsService,
    private userService: UserService) { }

  ngOnDestroy(): void {
    this.refreshFlightSubscription?.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.options = await this.optionsService.getAllOptions();

    const ui = this.userService.getUserInfo();
    if (ui) {
      this.userRole = ui.role;
    }

    if (ui) {
      this.userInfo = ui;
    }

    if (this.options.flightStatus) {
      this.flightStatuses = this.options.flightStatus;
    }

    await this.initFlights();

    this.refreshFlightSubscription = interval(this.interval_ms).subscribe(async x => {
      await this.initFlights();
    })
  }

  async initFlights() {
    try {
      const allFlights = await this.flightService.getByUserIdAsync(this.userInfo._id);
    if (allFlights && allFlights[0]) {
      this.flight = allFlights[0];
      if(this.flight.flightStep.isApproved == true || this.flight.isRejected == true){
        await this.flightService.refreshActiveFlight();
      }
    }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        
      } else {
        this.toastsService.showError("Сталась помилка. Оновіть сторінку і спробуйте знову.");
      }
    }
  }

  public get UserRoles() {
    return UserRole;
  }
}
