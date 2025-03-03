import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightSteps } from 'src/app/models/flight';
import { DroneOptions } from 'src/app/models/options';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-discord-option',
  templateUrl: './discord.component.html',
  styleUrls: ['./discord.component.scss']
})

export class DiscordStatusComponent {
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
}
