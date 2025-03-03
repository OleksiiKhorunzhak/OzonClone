import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  userRoles = UserRole;

  userInfo: User = {};

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const ui = this.userService.getUserInfo();

    if(ui) {
      this.userInfo = ui;
    }
  }
}
