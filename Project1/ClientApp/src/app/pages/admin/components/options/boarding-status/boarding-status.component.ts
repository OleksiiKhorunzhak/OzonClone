import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-boarding-status-option',
  templateUrl: './boarding-status.component.html',
  styleUrls: ['./boarding-status.component.scss']
})

export class BoardingStatusComponent implements OnInit {
    @Input() options!: DroneOptions;
    name: string = '';
    color: string = '';
    colorPlaceholder = 'Текст';
    selectedOption = -1;
    async ngOnInit(): Promise<void> {
    }
    constructor(private optionsService: OptionsService) {
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
