import { Component } from '@angular/core';
import { FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent {

  options: DroneOptions = {
    boardingStatuses: [],
    dronAppointment: [],
    dronModels: [],
    discordUrl: ''
  };

  defaultTabSelected: string = 'dronAppointment';
  name: string = '';
  color: string = '';

  selectedOption = -1;
  
  avaliableColors: string[] = [
    'rgb(89, 105, 255)',
    'rgb(255, 64, 123)'
  ]

  colorPlaceholder = 'Текст';
  encodedParam: string;
  constructor(private optionsService: OptionsService) {
    this.encodedParam = encodeURIComponent(JSON.stringify(this.options));
  }

  async ngOnInit(): Promise<void> {
    await this.optionsService.addFlightSteps();
    this.options = await this.optionsService.getAllOptions(true);
    this.encodedParam = encodeURIComponent(JSON.stringify(this.options));
  }

  public async changeDiscordUrl() {
    await this.optionsService.changeDiscordUrl(this.options.discordUrl);
    this.options = await this.optionsService.getAllOptions(true);
  }

  public async addNewOption(type: string) {
    await this.optionsService.addOption(this.name, this.color, type, this.selectedOption.toString());
    this.options = await this.optionsService.getAllOptions(true);

    this.name = '';
    this.color = '';
    this.selectedOption = -1;
  }

  public async removeOption(index:number, type: string) {
    await this.optionsService.removeOption(index, type);
    this.options = await this.optionsService.getAllOptions(true);
  }

  public async editOption(index: number, type: string) {
    this.selectedOption = index;

    if (this.options.flightStatus) {
      this.name = this.options.flightStatus[index].name;
      this.color = this.options.flightStatus[index].color;
    }
  }

  public changeLocalRoute(route: string){
    this.defaultTabSelected = route;
  }
}
