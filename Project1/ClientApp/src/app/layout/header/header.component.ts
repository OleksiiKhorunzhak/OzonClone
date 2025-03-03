import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationSkipped, Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';
import { User, UserRole } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  userRoles = UserRole;

  userInfo: User = {};

  currentUrl = '';

  backgroundColor = '#ffffff';
  
  onColorChanged(val: string) {
    document.getElementById('mainWrapper')!.style.backgroundColor = val;
  }

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const ui = this.userService.getUserInfo();

    if(ui) {
      this.userInfo = ui;
    }
    
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
