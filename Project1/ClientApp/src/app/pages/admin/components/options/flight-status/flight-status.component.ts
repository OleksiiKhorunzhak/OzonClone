import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-flight-status-option',
  templateUrl: './flight-status.component.html',
  styleUrls: ['./flight-status.component.scss']
})

export class FlightStatusComponent {
    @Input()
    options!: DroneOptions;
    name: string = '';
    color: string = '';
    colorPlaceholder = 'Текст';
    selectedOption = -1;
    ngOnInit(): void {
        
    }
    constructor(private optionsService: OptionsService) {
    }

    public async editOption(index: number, type: string) {
        this.selectedOption = index;
    
        if (this.options.flightStatus) {
          this.name = this.options.flightStatus[index].name;
          this.color = this.options.flightStatus[index].color;
        }
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
}
