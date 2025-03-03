import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../consts/consts';
import { DroneOptions } from '../models/options';
import { lastValueFrom } from 'rxjs';
import { FlightSteps } from '../models/flight';
import { Template } from '../models/user';
import {v4 as uuidv4} from 'uuid';

export interface OptionsCache {
  timestamp: number,
  data: DroneOptions
}

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  private readonly OPTIONS_API = API_URL + 'Options';

  private cache?: OptionsCache;
  private readonly cacheExpirationTime = 10 * 60 * 1000; // 10 mins

  constructor(public http: HttpClient) { }

  public async getAllOptions(forceUpdate: boolean = false): Promise<DroneOptions> {
    const now = Date.now();
    if (this.cache && now - this.cache.timestamp < this.cacheExpirationTime && forceUpdate == false) {
      return this.cache.data;
    } 
    else {
      try {
        const options = await lastValueFrom(this.http.get<DroneOptions[]>(this.OPTIONS_API))
        this.cache = {
          data: options[0] ?? {},
          timestamp: now
        }
        return this.cache.data;
      } catch (err) {
        if (forceUpdate == false && this.cache){
          return this.cache?.data;
        }
        else {
          throw err;
        }
      }
    }

    // const options = await lastValueFrom(this.http.get<DroneOptions[]>(this.OPTIONS_API))
    // return options[0] ?? {};
  }

  public async changeDiscordUrl(discordUrl?: string) {
    const options = await this.getAllOptions(true);
    const optionId = options._id;

    options.discordUrl = discordUrl;
    delete options._id;
    await lastValueFrom(this.http.put(`${this.OPTIONS_API}?optionsId=${optionId}`,options));
  }

  public async addOption(name: string, color: string, type: string, legacyId?: string) {

    const options = await this.getAllOptions(true);
    const optionId = options._id;

    if (type === 'boardingStatus') {

      if (!options.boardingStatuses) {
        options.boardingStatuses = [];
      }

      options.boardingStatuses?.push({
        color: color,
        name: name
      });
    }

    if (type === 'dronAppointment') {

      if (!options.dronAppointment) {
        options.dronAppointment = [];
      }

      var dronAppointmentOption = options.dronAppointment.find(x => x.legacyId == legacyId)

      if (dronAppointmentOption) {
        dronAppointmentOption.color = color;
        dronAppointmentOption.name = name;
        dronAppointmentOption.legacyId = legacyId;
      }else{
        options.dronAppointment?.push({
          color: color,
          name: name,
          legacyId: uuidv4()
        });
      }
    }

    if (type === 'dronModel') {

      if (!options.dronModels) {
        options.dronModels = [];
      }

      var dronModelOption = options.dronModels.find(x => x.legacyId == legacyId)

      if (dronModelOption) {
        dronModelOption.name = name;
        dronModelOption.legacyId = legacyId;
      }else{
        options.dronModels?.push({
          color: color,
          name: name,
          legacyId: uuidv4()
        });
      }
    }

    if (type === 'flightStatus') {

      if (!options.flightStatus) {
        options.flightStatus = [];
      }

      var flightStatusOption = options.flightStatus.find(x => x.legacyId == legacyId)

      if (flightStatusOption) {
        flightStatusOption.color = color;
        flightStatusOption.name = name;
      }
    }
    
    delete options._id;
    await lastValueFrom(this.http.put(`${this.OPTIONS_API}?optionsId=${optionId}`,options));

  }

  public async removeOption(index: number, type: string) {
    const options = await this.getAllOptions(true);
    const optionId = options._id;

    if (type === 'boardingStatus') {
      options.boardingStatuses?.splice(index, 1);
    }

    if (type === 'dronAppointment') {
      options.dronAppointment?.splice(index, 1);
    }

    if (type === 'dronModel') {
      options.dronModels?.splice(index, 1);
    }

    delete options._id;
    
    await lastValueFrom(this.http.put(`${this.OPTIONS_API}?optionsId=${optionId}`,options));

  }

  private readonly statuses = ['Початок','Політ','ЛБЗ Вперед','Повернення','ЛБЗ Назад','Початок зниження','Завершено']

  public async addFlightSteps() {
    const options = await this.getAllOptions(true);
    const optionId = options._id;

    if(!options.flightStatus || options.flightStatus.length === 0) {
      options.flightStatus = [];

      Object.values(FlightSteps).forEach(async step => {
        if(!isNaN(Number(step))) {
          options.flightStatus?.push({
            color: '#5969ff',
            name: this.statuses[Number(step)],
            legacyId: step.toString()
          });
        }
      });

      delete options._id;
    
      await lastValueFrom(this.http.put(`${this.OPTIONS_API}?optionsId=${optionId}`,options));
    }
  }
  // const mapp: DroneOptions = {
  //   "boardingStatuses": [
  //     {
  //       "name": "Цілий",
  //       "color": ""
  //     },
  //     {
  //       "name": "Пошкоджений",
  //       "color": ""
  //     },
  //     {
  //       "name": "Втрата",
  //       "color": ""
  //     }
  //   ],
  //   "dronAppointment": [
  //     {
  //       "name": "РОЗВІДУВАЛЬНИЙ",
  //       "color": ""
  //     },
  //     {
  //       "name": "УДАРНИЙ",
  //       "color": ""
  //     },
  //     {
  //       "name": "МАВІКИ",
  //       "color": ""
  //     }
  //   ],
  //   "dronModels": [
  //     {
  //       "name": "ЛЕЛЕКА",
  //       "color": ""
  //     },
  //     {
  //       "name": "МАВІК 3Т",
  //       "color": ""
  //     },
  //     {
  //       "name": "ФУРІЯ",
  //       "color": ""
  //     },
  //     {
  //       "name": "ШАРК",
  //       "color": ""
  //     },
  //     {
  //       "name": "МАВІК",
  //       "color": ""
  //     },
  //     {
  //       "name": "ВАЛЬКІРІЯ",
  //       "color": ""
  //     }
  //   ]
  // }

}
