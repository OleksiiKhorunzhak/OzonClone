import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { Flight, FlightSteps } from 'src/app/models/flight';
import { User, UserRole } from 'src/app/models/user';
import { FlightService } from 'src/app/services/flight.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() isAdminPage = false;

  userRoles = UserRole;

  userInfo: User = {};

  currentUrl = '';

  constructor(private flightService: FlightService, private userService: UserService, private router: Router) { }

  async ngOnInit(): Promise<void> {

    const ui = this.userService.getUserInfo();

    if(ui) {
      this.userInfo = ui;
    }

    this.currentUrl = this.router.url;

    this.router.events.pipe(filter(x => x instanceof NavigationEnd || x instanceof Scroll)).subscribe(x => {
      if (x instanceof NavigationEnd) {
        this.currentUrl = (x as NavigationEnd).url;
      }
      if (x instanceof Scroll) {
        this.currentUrl = (x as Scroll).routerEvent.url;
      }
    })
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

}
