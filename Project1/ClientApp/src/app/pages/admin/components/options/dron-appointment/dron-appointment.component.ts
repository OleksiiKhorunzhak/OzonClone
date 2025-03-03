import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-dron-appointment-option',
  templateUrl: './dron-appointment.component.html',
  styleUrls: ['./dron-appointment.component.scss']
})

export class DronAppointmentComponent {
    @Input()
    options!: DroneOptions;
    name: string = '';
    color: string = '';
    colorPlaceholder = 'Текст';
    selectedOption = -1;
    legacyId = '';
    ngOnInit(): void {
        
    }
    constructor(private optionsService: OptionsService) {
    }

    public async addNewOption(type: string) {
        await this.optionsService.addOption(this.name, this.color, type, this.legacyId.toString());
        this.options = await this.optionsService.getAllOptions(true);
    
        this.name = '';
        this.color = '';
        this.selectedOption = -1;
        this.legacyId = this.legacyId;
      }

    public async removeOption(index:number, type: string) {
        await this.optionsService.removeOption(index, type);
        this.options = await this.optionsService.getAllOptions(true);
    }

    public async editOption(index: number, type: string) {
      this.selectedOption = index;
      if (this.options.dronAppointment) {
        this.name = this.options.dronAppointment[index].name;
        this.color = this.options.dronAppointment[index].color;
        this.legacyId = this.options.dronAppointment[index].legacyId ?? '';
      }
    }
}