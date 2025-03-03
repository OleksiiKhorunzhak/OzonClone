import { Component, Input, OnInit } from '@angular/core';
import { ValueColor } from 'src/app/models/droneModel';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { UserRole } from 'src/app/models/user';
import { OptionsService } from 'src/app/services/options.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss']
})
export class FlightCardComponent implements OnInit {

  @Input() isCollapsable = false;

  @Input() flight: Flight | null = null;

  userRole?: UserRole;

  flightStatuses: ValueColor[] = [];

  options?: DroneOptions;

  constructor(private userService: UserService,
              private optionsService: OptionsService) {

  }


  async ngOnInit(): Promise<void> {
    var ui = this.userService.getUserInfo();
    if (ui) {
      this.userRole = ui.role;
    }
    
    this.options = await this.optionsService.getAllOptions();

    if (this.options.flightStatus) {
      this.flightStatuses = this.options.flightStatus;
    }
  }

  public get UserRoles() {
    return UserRole;
  }

  public get FlightSteps() {
    return FlightSteps;
  }
}
