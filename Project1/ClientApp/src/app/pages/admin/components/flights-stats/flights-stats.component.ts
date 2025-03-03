import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as saveAs from 'file-saver';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { YesNoModalComponent } from 'src/app/pages/shared/yes-no-modal/yes-no-modal.component';
import { FlightService } from 'src/app/services/flight.service';

export interface AdminFlight extends Flight {
  isCheckedAdmin?: boolean;
}

@Component({
  selector: 'app-flights-stats',
  templateUrl: './flights-stats.component.html',
  styleUrls: ['./flights-stats.component.scss']
})
export class FlightsStatsComponent implements OnInit {

  flights: AdminFlight[] = [];

  firstPart: AdminFlight[] = [];
  secondPart: AdminFlight[] = [];

  isExpanded = false;
  expanded: AdminFlight | null = null;

  FlightSteps = FlightSteps;

  constructor(
    private flightService: FlightService,
    private modalService: NgbModal) { }

  async ngOnInit(): Promise<void> {
    await this.getAllFlights();
  }

  async removeFlight(id: string | undefined) {
    if (id) {
      await this.flightService.removeFlight(id);
      await this.getAllFlights();
    }
  }

  async getAllFlights() {
    this.flights = (await this.flightService.getAllFlightsAsync())
      .sort((a, b) => new Date(b.dateOfFlight ?? '').getTime() - new Date(a.dateOfFlight ?? '').getTime());

    this.firstPart = [...this.flights];

  }

  expand(i: number) {
    if (this.expanded) {
      this.expanded = null;
      this.firstPart = [...this.flights];
      this.secondPart = [];

      return;
    }

    this.expanded = this.flights[i];
    this.firstPart = [...this.flights];
    this.secondPart = [...this.firstPart.splice(i + 1)];
  }

  isLoading = false;
  downloadFile(): void {
    this.isLoading = true;
    this.flightService.downloadFile().subscribe(res => {
      var filename = res.headers.get('Content-Disposition')!.split(';')[1].split('filename')[1].split('=')[1].trim();
      saveAs(res.body as Blob, filename);

      this.isLoading = false;
    });
  }

  isAllSelected = false;

  selectAll() {
    this.isAllSelected = !this.isAllSelected;
    this.flights.forEach(element => {
      element.isCheckedAdmin = this.isAllSelected;
    });
  }

  selectAllUnfinished() {
    this.isAllSelected = false;
    this.flights.forEach(element => {
      if(element.flightStep.step === FlightSteps.END) {
        element.isCheckedAdmin = true;
      } else {
        element.isCheckedAdmin = false;
      }
      
    });
  }

  deleteSelected() {
    const modal = this.modalService.open(YesNoModalComponent);
    modal.componentInstance.text = 'Ви впевнені?';
    modal.componentInstance.yes = 'Так';
    modal.componentInstance.no = 'Ні';

    modal.closed.subscribe(async res => {
      if (res == true) {
        const ids = this.flights.filter(x => x.isCheckedAdmin === true).map(x => x._id!);

        await this.flightService.removeFlightRange(ids);
        await this.getAllFlights();
      }
    });
  }
}
